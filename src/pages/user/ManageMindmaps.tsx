import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../css/MindmapManager.css";
import {
  createMindmap,
  deleteMindmap,
  getMindmapDetail,
  listUserMindmaps,
  MindmapResponse,
  MindmapSummary,
  triggerMindmapNotification,
  updateMindmap,
} from "../../api/mindmap";
import { useAuth } from "contexts/AuthContext";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

type Props = {
  token: string;
  userId: string;
};

type FormState = {
  name: string;
  prompt: string;
  project: string;
};

type RawMindmapNode = {
  id?: string;
  label?: string;
  parentId?: string | null;
  notes?: string;
  children?: RawMindmapNode[];
};

type RawMindmapPayload = {
  title?: string;
  description?: string;
  nodes?: RawMindmapNode[];
  nodeTree?: RawMindmapNode[];
};

type MindmapTreeNode = {
  id: string;
  label: string;
  parentId?: string | null;
  notes?: string;
  children: MindmapTreeNode[];
};

type ParsedMindmap = {
  title: string;
  description?: string;
  roots: MindmapTreeNode[];
};

type NodeVisualConfig = {
  type: "circle" | "pill" | "hexagon";
  fill: string;
  stroke: string;
  labelColor: string;
  noteColor: string;
  labelFontSize: number;
  noteFontSize: number;
  labelMaxChars: number;
  labelMaxLines: number;
  noteMaxChars: number;
  noteMaxLines: number;
  radius?: number;
  width?: number;
  height?: number;
};

const NODE_VISUALS: NodeVisualConfig[] = [
  {
    type: "circle",
    fill: "#FDBA1D",
    stroke: "#F97316",
    labelColor: "#0F172A",
    noteColor: "#78350F",
    labelFontSize: 16,
    noteFontSize: 12,
    labelMaxChars: 24,
    labelMaxLines: 3,
    noteMaxChars: 32,
    noteMaxLines: 3,
    radius: 90,
  },
  {
    type: "pill",
    fill: "#3B82F6",
    stroke: "#1D4ED8",
    labelColor: "#FFFFFF",
    noteColor: "#E0F2FE",
    labelFontSize: 14,
    noteFontSize: 11,
    labelMaxChars: 26,
    labelMaxLines: 2,
    noteMaxChars: 32,
    noteMaxLines: 2,
    width: 210,
    height: 70,
  },
  {
    type: "hexagon",
    fill: "#38BDF8",
    stroke: "#0284C7",
    labelColor: "#FFFFFF",
    noteColor: "#E0F2FE",
    labelFontSize: 13,
    noteFontSize: 11,
    labelMaxChars: 24,
    labelMaxLines: 2,
    noteMaxChars: 28,
    noteMaxLines: 2,
    width: 170,
    height: 70,
  },
];

const emptyForm: FormState = {
  name: "",
  prompt: "",
  project: "",
};

function describeError(err: any, fallback: string) {
  const status = err?.status ?? err?.response?.status;
  console.log(fallback)
  if (status === 401 || status === 403) {
    return "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.";
  }
  if (status === 404) {
    return "Mindmap này không còn tồn tại.";
  }
  if (status && status >= 500) {
    return `Mindmap service gặp sự cố (${status}). Thử lại sau.`;
  }
  if (status && status >= 400) {
    return `Yêu cầu không hợp lệ (${status}). Vui lòng kiểm tra lại dữ liệu.`;
  }
  return err?.message || fallback;
}

export default function ManageMindmaps({ token, userId }: Props) {
  const [mindmaps, setMindmaps] = useState<MindmapSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMindmap, setSelectedMindmap] = useState<MindmapResponse | null>(
    null
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<FormState>(emptyForm);
  const [creating, setCreating] = useState(false);

  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [updating, setUpdating] = useState(false);

  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const {user} = useAuth()

  useEffect(() => {
    void loadMindmaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId]);

  useEffect(() => {
    if (selectedMindmap?.metadata) {
      setEditForm({
        name: selectedMindmap.metadata.name || "",
        prompt: selectedMindmap.metadata.prompt || "",
        project: selectedMindmap.metadata.project || "",
      });
    } else {
      setEditForm(emptyForm);
    }
  }, [
    selectedMindmap?.metadata?.id,
    selectedMindmap?.metadata?.updatedAt,
    selectedMindmap?.metadata?.prompt,
  ]);

  useEffect(() => {
    if (!loadingList && mindmaps.length > 0 && !selectedId) {
      void loadMindmapDetail(mindmaps[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingList, mindmaps, selectedId]);

  const prettyMindmap = useMemo(() => {
    if (!selectedMindmap?.mindmap) return null;
    try {
      return JSON.stringify(selectedMindmap.mindmap, null, 2);
    } catch (error) {
      return `${selectedMindmap.mindmap}`;
    }
  }, [selectedMindmap]);

const parsedMindmap = useMemo(
  () =>
    parseMindmap(
      selectedMindmap?.mindmap,
      selectedMindmap?.metadata?.name || selectedMindmap?.metadata?.prompt
    ),
  [selectedMindmap]
);

  const hasEditChanges = useMemo(() => {
    if (!selectedMindmap?.metadata) return false;
    return (
      (editForm.name || "") !== (selectedMindmap.metadata.name || "") ||
      (editForm.prompt || "") !== (selectedMindmap.metadata.prompt || "") ||
      (editForm.project || "") !== (selectedMindmap.metadata.project || "")
    );
  }, [editForm, selectedMindmap]);

  async function loadMindmaps(showLoader: boolean = true) {
    if (showLoader) {
      setLoadingList(true);
    }
    setListError(null);

    try {
      const data = await listUserMindmaps(token, userId);
      setMindmaps(data);

      if (selectedId && !data.some((item) => item.id === selectedId)) {
        setSelectedId(null);
        setSelectedMindmap(null);
      }

      return data;
    } catch (error: any) {
      setListError(describeError(error, "Không thể tải danh sách mindmap"));
      return [];
    } finally {
      if (showLoader) {
        setLoadingList(false);
      }
    }
  }

  async function loadMindmapDetail(summary: MindmapSummary) {
    setSelectedId(summary.id);
    setDetailLoading(true);
    setDetailError(null);
    try {
      const detail = await getMindmapDetail(token, userId, summary.id);
      setSelectedMindmap(detail);
    } catch (error: any) {
      setDetailError(describeError(error, "Không thể tải chi tiết mindmap"));
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!createForm.prompt.trim()) return;

    try {
      setCreating(true);
      const payload = {
        userId,
        prompt: createForm.prompt.trim(),
        name: createForm.name.trim() || undefined,
        project: createForm.project.trim() || undefined,
      };
      const response = await createMindmap(token, payload);
      setInfoMessage("Đã gửi yêu cầu tạo mindmap. Vui lòng chờ trong giây lát.");
      setCreateForm(emptyForm);
      await loadMindmaps(false);
      setSelectedId(response.metadata.id);
      setSelectedMindmap(response);
    } catch (error: any) {
      setListError(describeError(error, "Không thể tạo mindmap mới"));
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId || !hasEditChanges) return;

    try {
      setUpdating(true);
      const payload = {
        name: editForm.name.trim() || undefined,
        prompt: editForm.prompt.trim() || undefined,
        project: editForm.project.trim() || undefined,
      };
      const response = await updateMindmap(token, userId, selectedId, payload);
      setSelectedMindmap(response);
      setInfoMessage("Đã cập nhật mindmap.");
      await loadMindmaps(false);
    } catch (error: any) {
      setDetailError(describeError(error, "Không thể cập nhật mindmap"));
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!selectedId) return;
    const confirmed = window.confirm(
      "Bạn có chắc muốn xoá mindmap này? Hành động không thể phục hồi."
    );
    if (!confirmed) return;

    try {
      setUpdating(true);
      await deleteMindmap(token, userId, selectedId);
      setInfoMessage("Đã xoá mindmap.");
      setSelectedId(null);
      setSelectedMindmap(null);
      const remaining = await loadMindmaps();
      if (remaining.length > 0) {
        void loadMindmapDetail(remaining[0]);
      }
    } catch (error: any) {
      setDetailError(describeError(error, "Không thể xoá mindmap"));
    } finally {
      setUpdating(false);
    }
  }

  async function handleNotify() {
    if (!selectedId) return;
    try {
      setUpdating(true);
      await triggerMindmapNotification(token, userId, selectedId);
      setInfoMessage("Đã gửi thông báo về email / notification hub.");
    } catch (error: any) {
      setDetailError(describeError(error, "Không thể gửi thông báo"));
    } finally {
      setUpdating(false);
    }
  }

  function formatDate(value?: string) {
    if (!value) return "Đang cập nhật";
    try {
      return new Date(value).toLocaleString("vi-VN");
    } catch {
      return value;
    }
  }

  function statusClass(status?: string) {
    if (!status) return "mindmap-status-badge";
    const normalized = status.toLowerCase();
    if (normalized.includes("ready") || normalized.includes("done")) {
      return "mindmap-status-badge mindmap-status-ready";
    }
    if (normalized.includes("fail") || normalized.includes("error")) {
      return "mindmap-status-badge mindmap-status-failed";
    }
    return "mindmap-status-badge mindmap-status-processing";
  }

  return (
    <div className="mindmap-page">
      {infoMessage && (
        <div className="mindmap-alert info">
          {infoMessage}
          <button
            className="mindmap-btn secondary"
            style={{ marginLeft: "0.75rem" }}
            onClick={() => setInfoMessage(null)}
          >
            X
          </button>
        </div>
      )}
      {listError && <div className="mindmap-alert error">{listError}</div>}

      <div className="mindmap-grid">
        <section className="mindmap-card mindmap-list">
          <div className="mindmap-list-header">
            <div>
              <h2>Mindmap của tôi {user?.id}</h2>
              <span className="mindmap-meta-info">
                {mindmaps.length} mindmap đã được tạo
              </span>
            </div>
            <button
              className="mindmap-btn secondary"
              onClick={() => void loadMindmaps()}
              disabled={loadingList}
            >
              Tải lại
            </button>
          </div>

          {loadingList ? (
            <div className="mindmap-empty">Đang tải danh sách...</div>
          ) : mindmaps.length === 0 ? (
            <div className="mindmap-empty">
              Bạn chưa có mindmap nào. Sử dụng form bên phải để tạo mới.
            </div>
          ) : (
            <div className="mindmap-items">
              {mindmaps.map((map) => (
                <div
                  key={map.id}
                  className={`mindmap-item ${
                    selectedId === map.id ? "active" : ""
                  }`}
                  onClick={() => void loadMindmapDetail(map)}
                >
                  <div className="mindmap-item-title">
                    {map.name || "Mindmap không tên"}
                  </div>
                  <div className="mindmap-item-prompt">{map.prompt}</div>
                  <div className="mindmap-item-footer">
                    <span className={statusClass(map.status)}>
                      {map.status || "processing"}
                    </span>
                    <span>{formatDate(map.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mindmap-card mindmap-create-form">
          <div className="mindmap-list-header">
            <h2>Tạo mindmap mới</h2>
            <span className="mindmap-meta-info">
              Gateway: mindmap-service/api/mindmaps
            </span>
          </div>

          <form onSubmit={handleCreate}>
            <div className="mindmap-field">
              <label>Tên mindmap</label>
              <input
                type="text"
                value={createForm.name}
                placeholder="Ví dụ: Lộ trình học BioChem"
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="mindmap-field">
              <label>Dự án</label>
              <input
                type="text"
                value={createForm.project}
                placeholder="(Không bắt buộc)"
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, project: e.target.value }))
                }
              />
            </div>
            <div className="mindmap-field">
              <label>Prompt</label>
              <textarea
                value={createForm.prompt}
                placeholder="Nhập prompt để Gemini tạo mindmap..."
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, prompt: e.target.value }))
                }
                required
              />
            </div>
            <button
              type="submit"
              className="mindmap-btn primary"
              disabled={creating || !createForm.prompt.trim()}
            >
              {creating ? "Đang gửi..." : "Tạo mindmap"}
            </button>
          </form>
        </section>
      </div>

      <section className="mindmap-card mindmap-detail">
        <div className="mindmap-detail-header">
          <h2>Chi tiết mindmap</h2>
          {selectedMindmap?.metadata?.status && (
            <span className={statusClass(selectedMindmap.metadata.status)}>
              {selectedMindmap.metadata.status}
            </span>
          )}
        </div>

        {detailError && (
          <div className="mindmap-alert error">
            {detailError}
            <button
              className="mindmap-btn secondary"
              style={{ marginLeft: "0.75rem" }}
              onClick={() => setDetailError(null)}
            >
              X
            </button>
          </div>
        )}

        {!selectedMindmap && !selectedId ? (
          <div className="mindmap-empty-detail">
            Hãy chọn mindmap trong danh sách bên trái để xem chi tiết.
          </div>
        ) : detailLoading ? (
          <div className="mindmap-empty-detail">Đang tải chi tiết...</div>
        ) : selectedMindmap ? (
          <div className="mindmap-detail-body">
            <div className="mindmap-metadata-grid">
              <div className="mindmap-metadata-item">
                <span>Mã mindmap</span>
                <strong>{selectedMindmap.metadata.id}</strong>
              </div>
              <div className="mindmap-metadata-item">
                <span>Dự án</span>
                <strong>{selectedMindmap.metadata.project || "Chưa có"}</strong>
              </div>
              <div className="mindmap-metadata-item">
                <span>File</span>
                <strong>{selectedMindmap.metadata.filename || "Chưa tạo"}</strong>
              </div>
              <div className="mindmap-metadata-item">
                <span>Cập nhật</span>
                <strong>{formatDate(selectedMindmap.metadata.updatedAt)}</strong>
              </div>
            </div>

            <div className="mindmap-edit-form">
              <form onSubmit={handleUpdate}>
                <div className="mindmap-field">
                  <label>Tên</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="mindmap-field">
                  <label>Dự án</label>
                  <input
                    type="text"
                    value={editForm.project}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        project: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mindmap-field">
                  <label>Prompt</label>
                  <textarea
                    value={editForm.prompt}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        prompt: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="mindmap-actions">
                  <button
                    type="submit"
                    className="mindmap-btn primary"
                    disabled={updating || !hasEditChanges}
                  >
                    {updating ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <button
                    type="button"
                    className="mindmap-btn secondary"
                    onClick={handleNotify}
                    disabled={updating}
                  >
                    Gửi thông báo
                  </button>
                  <button
                    type="button"
                    className="mindmap-btn danger"
                    onClick={handleDelete}
                    disabled={updating}
                  >
                    Xoá
                  </button>
                </div>
              </form>
            </div>

            {parsedMindmap ? (
              <MindmapTreeView mindmap={parsedMindmap} />
            ) : (
              prettyMindmap && (
                <div>
                  <h3>Nội dung mindmap (JSON thô)</h3>
                  <pre className="mindmap-json">{prettyMindmap}</pre>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="mindmap-empty-detail">
            Không tải được mindmap đã chọn.
          </div>
        )}
      </section>
    </div>
  );
}

function parseMindmap(
  payload: unknown,
  fallbackTitle?: string | null
): ParsedMindmap | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const source = payload as RawMindmapPayload;
  const title = source.title || fallbackTitle || "Mindmap";
  const description = source.description;

  if (Array.isArray(source.nodeTree) && source.nodeTree.length > 0) {
    const roots = source.nodeTree
      .map(normalizeNode)
      .filter((node): node is MindmapTreeNode => Boolean(node));
    if (roots.length > 0) {
      return { title, description, roots };
    }
  }

  if (Array.isArray(source.nodes) && source.nodes.length > 0) {
    const nestedRoots = source.nodes
      .filter((node) => !node.parentId)
      .map(normalizeNode)
      .filter((node): node is MindmapTreeNode => Boolean(node));
    if (nestedRoots.length > 0) {
      return { title, description, roots: nestedRoots };
    }

    const treeFromFlat = buildTreeFromFlatNodes(source.nodes);
    if (treeFromFlat.length > 0) {
      return { title, description, roots: treeFromFlat };
    }
  }

  return null;
}

function normalizeNode(node?: RawMindmapNode | null): MindmapTreeNode | null {
  if (!node?.id) {
    return null;
  }
  const children = Array.isArray(node.children)
    ? node.children
        .map(normalizeNode)
        .filter((child): child is MindmapTreeNode => Boolean(child))
    : [];
  return {
    id: node.id,
    label: node.label || "Untitled",
    parentId: node.parentId ?? null,
    notes: node.notes || undefined,
    children,
  };
}

function buildTreeFromFlatNodes(nodes: RawMindmapNode[]): MindmapTreeNode[] {
  const lookup = new Map<string, MindmapTreeNode>();
  nodes.forEach((node) => {
    if (!node.id) {
      return;
    }
    lookup.set(node.id, {
      id: node.id,
      label: node.label || "Untitled",
      parentId: node.parentId ?? null,
      notes: node.notes || undefined,
      children: [],
    });
  });

  const roots: MindmapTreeNode[] = [];
  lookup.forEach((node) => {
    if (node.parentId && lookup.has(node.parentId)) {
      lookup.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function buildRadialLayout(root: LayoutTreeNode, radiusStep: number): RadialLayout {
  const weights = new Map<string, number>();
  computeLeafWeights(root, weights);
  const nodes: PositionedMindmapNode[] = [];
  const links: RadialLayout["links"] = [];
  layoutNodeRadially(
    root,
    -Math.PI / 2,
    (Math.PI * 3) / 2,
    0,
    radiusStep,
    weights,
    nodes,
    links,
    undefined
  );
  return { nodes, links };
}

function computeLeafWeights(node: LayoutTreeNode, map: Map<string, number>): number {
  if (!node.children || node.children.length === 0) {
    map.set(node.id, 1);
    return 1;
  }
  let sum = 0;
  node.children.forEach((child) => {
    sum += computeLeafWeights(child, map);
  });
  map.set(node.id, sum);
  return sum;
}

function layoutNodeRadially(
  node: LayoutTreeNode,
  startAngle: number,
  endAngle: number,
  depth: number,
  radiusStep: number,
  weights: Map<string, number>,
  nodes: PositionedMindmapNode[],
  links: RadialLayout["links"],
  parentId?: string
) {
  const radius = depth * radiusStep;
  const angle = depth === 0 ? 0 : (startAngle + endAngle) / 2;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  nodes.push({
    id: node.id,
    label: node.label,
    notes: node.notes,
    depth,
    x,
    y,
    parentId,
  });

  if (parentId) {
    links.push({ sourceId: parentId, targetId: node.id });
  }

  if (!node.children || node.children.length === 0) {
    return;
  }

  const totalWeight = node.children.reduce(
    (acc, child) => acc + (weights.get(child.id) ?? 1),
    0
  );
  const range = endAngle - startAngle;
  let cursor = startAngle;

  node.children.forEach((child) => {
    const childWeight = weights.get(child.id) ?? 1;
    const share = range * (childWeight / (totalWeight || 1));
    layoutNodeRadially(
      child,
      cursor,
      cursor + share,
      depth + 1,
      radiusStep,
      weights,
      nodes,
      links,
      node.id
    );
    cursor += share;
  });
}

type LayoutTreeNode = {
  id: string;
  label: string;
  notes?: string;
  children: LayoutTreeNode[];
};

type PositionedMindmapNode = {
  id: string;
  label: string;
  notes?: string;
  depth: number;
  x: number;
  y: number;
  parentId?: string;
};

type RadialLayout = {
  nodes: PositionedMindmapNode[];
  links: Array<{ sourceId: string; targetId: string }>;
};

function MindmapTreeView({ mindmap }: { mindmap: ParsedMindmap }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [zoom, setZoom] = useState(0.95);

  useEffect(() => {
    function updateDimensions() {
      if (!containerRef.current) {
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.max(rect.width, 400),
        height: Math.max(rect.height, 400),
      });
    }
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const layout = useMemo(() => {
    if (!mindmap.roots.length) {
      return null;
    }
    const rootedTree: LayoutTreeNode = {
      id: "mindmap-root",
      label: mindmap.title,
      notes: mindmap.description,
      children: mindmap.roots,
    };
    return buildRadialLayout(rootedTree, 170);
  }, [mindmap]);

  const adjustZoom = (delta: number) => {
    setZoom((prev) => {
      const next = Math.min(1.6, Math.max(0.5, prev + delta));
      return parseFloat(next.toFixed(2));
    });
  };

  if (!layout) {
    return (
      <div className="mindmap-empty-detail">Mindmap chưa có dữ liệu cây.</div>
    );
  }

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  return (
    <div className="mindmap-tree mindmap-tree--d3">
      <div className="mindmap-tree-header">
        <div>
          <h3>{mindmap.title}</h3>
          {mindmap.description && (
            <p className="mindmap-tree-description">{mindmap.description}</p>
          )}
        </div>
        <div className="mindmap-tree-controls">
          <button
            type="button"
            className="mindmap-btn secondary"
            onClick={() => adjustZoom(-0.1)}
            aria-label="Thu nhỏ"
          >
            -
          </button>
          <button
            type="button"
            className="mindmap-btn secondary"
            onClick={() => adjustZoom(0.1)}
            aria-label="Phóng to"
          >
            +
          </button>
          <button
            type="button"
            className="mindmap-btn secondary"
            onClick={() => setZoom(0.95)}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="mindmap-tree-canvas" ref={containerRef}>
        <svg width="100%" height="100%">
          <g transform={`translate(${centerX}, ${centerY}) scale(${zoom})`}>
            {layout.links.map((link) => {
              const source = layout.nodes.find((n) => n.id === link.sourceId);
              const target = layout.nodes.find((n) => n.id === link.targetId);
              if (!source || !target) {
                return null;
              }
              return (
                <line
                  key={`${link.sourceId}-${link.targetId}`}
                  className="mindmap-tree-link"
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                />
              );
            })}
            {layout.nodes.map((node) => (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <MindmapNode node={node} />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

function MindmapNode({ node }: { node: PositionedMindmapNode }) {
  const depth = node.depth;
  const config = getVisualConfig(depth);
  const notes = node.notes;
  const labelLines = wrapText(
    node.label || "",
    config.labelMaxChars,
    config.labelMaxLines
  );
  const noteLines = wrapText(
    notes,
    config.noteMaxChars,
    config.noteMaxLines
  );
  const labelLineHeight = config.labelFontSize + 4;
  const noteLineHeight = config.noteFontSize + 2;
  const blockSpacing = noteLines.length > 0 ? 10 : 0;
  const totalHeight =
    labelLines.length * labelLineHeight +
    noteLines.length * noteLineHeight +
    blockSpacing;
  const firstLabelY = -totalHeight / 2 + labelLineHeight / 2;
  const afterLabelsY =
    firstLabelY + labelLines.length * labelLineHeight + blockSpacing - labelLineHeight / 2;

  const labelElements = labelLines.map((line, idx) => {
    const y = firstLabelY + idx * labelLineHeight;
    return (
      <text
        key={`${node.id}-label-${idx}`}
        className="mindmap-node-title"
        x={0}
        y={y}
        fontSize={config.labelFontSize}
        fill={config.labelColor}
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {line}
      </text>
    );
  });

  const noteElements = noteLines.map((line, idx) => (
    <text
      key={`${node.id}-note-${idx}`}
      className="mindmap-node-notes"
      x={0}
      y={afterLabelsY + idx * noteLineHeight}
      fontSize={config.noteFontSize}
      fill={config.noteColor}
      dominantBaseline="middle"
      textAnchor="middle"
    >
      {line}
    </text>
  ));

  return (
    <g className={`mindmap-node depth-${Math.min(depth, NODE_VISUALS.length - 1)}`}>
      {renderNodeShape(config)}
      {labelElements}
      {noteElements}
    </g>
  );
}

function wrapText(text?: string, limit = 30, maxLines = 3): string[] {
  if (!text) {
    return [];
  }
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  let usedAllWords = true;

  for (const word of words) {
    const tentative = current ? `${current} ${word}` : word;
    if (tentative.length <= limit) {
      current = tentative;
    } else {
      if (current) {
        lines.push(current);
      }
      current = word;
      if (lines.length === maxLines - 1) {
        usedAllWords = false;
        break;
      }
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  } else if (current && lines.length === maxLines) {
    usedAllWords = false;
    lines[maxLines - 1] = current;
  }

  if (!usedAllWords && lines.length > 0) {
    const lastIdx = lines.length - 1;
    if (!lines[lastIdx].endsWith("…")) {
      lines[lastIdx] = `${lines[lastIdx]}…`;
    }
  }

  return lines;
}

function getVisualConfig(depth: number): NodeVisualConfig {
  return NODE_VISUALS[Math.min(depth, NODE_VISUALS.length - 1)];
}

function renderNodeShape(config: NodeVisualConfig) {
  switch (config.type) {
    case "circle": {
      const radius = config.radius ?? 80;
      return (
        <circle
          r={radius}
          fill={config.fill}
          stroke={config.stroke}
          strokeWidth={5}
        />
      );
    }
    case "pill": {
      const width = config.width ?? NODE_WIDTH;
      const height = config.height ?? NODE_HEIGHT;
      return (
        <rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          rx={height / 2}
          ry={height / 2}
          fill={config.fill}
          stroke={config.stroke}
          strokeWidth={4}
        />
      );
    }
    case "hexagon":
    default: {
      const width = config.width ?? NODE_WIDTH * 0.85;
      const height = config.height ?? NODE_HEIGHT;
      const points = buildHexagonPoints(width, height);
      return (
        <polygon
          points={points}
          fill={config.fill}
          stroke={config.stroke}
          strokeWidth={4}
        />
      );
    }
  }
}

function buildHexagonPoints(width: number, height: number): string {
  const w = width / 2;
  const h = height / 2;
  const top = -h;
  const bottom = h;
  const midX = w * 0.6;
  return [
    `${-midX},${top}`,
    `${midX},${top}`,
    `${w},0`,
    `${midX},${bottom}`,
    `${-midX},${bottom}`,
    `${-w},0`,
  ].join(" ");
}
