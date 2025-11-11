import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "../../css/MindmapManager.css";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Panel,
  getRectOfNodes,
} from "reactflow";
import "reactflow/dist/style.css";
import { toPng, toSvg } from "html-to-image";
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

const emptyForm: FormState = {
  name: "",
  prompt: "",
  project: "",
};

function describeError(err: any, fallback: string) {
  const status = err?.status ?? err?.response?.status;
  console.log(fallback);
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
  const [selectedMindmap, setSelectedMindmap] =
    useState<MindmapResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<FormState>(emptyForm);
  const [creating, setCreating] = useState(false);

  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [updating, setUpdating] = useState(false);

  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const { user } = useAuth();

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
  }, [selectedMindmap?.metadata]);

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

    setCreating(true);

    try {
      const payload = {
        userId,
        prompt: createForm.prompt.trim(),
        name: createForm.name.trim() || undefined,
        project: createForm.project.trim() || undefined,
      };

      await createMindmap(token, payload);

      setCreateForm(emptyForm);

      // Wait 15 seconds for backend to process, then reload page
      let countdown = 15;
      setInfoMessage(
        `Đang tạo mindmap. Tự động tải lại sau ${countdown} giây...`
      );

      const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          setInfoMessage(
            `Đang tạo mindmap. Tự động tải lại sau ${countdown} giây...`
          );
        } else {
          setInfoMessage("Đang tải lại trang...");
        }
      }, 1000);

      await new Promise((resolve) => setTimeout(resolve, 15000));

      clearInterval(countdownInterval);

      // Reload page to get fresh data
      window.location.reload();
    } catch (error: any) {
      setCreating(false);
      setListError(describeError(error, "Không thể tạo mindmap mới"));
    }
    // Don't set setCreating(false) here - page will reload anyway
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

  function handleDownloadJSON() {
    if (!selectedMindmap) return;

    try {
      // Export JSON data
      const jsonData = JSON.stringify(selectedMindmap.mindmap, null, 2);
      const jsonBlob = new Blob([jsonData], { type: "application/json" });
      const jsonUrl = URL.createObjectURL(jsonBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = jsonUrl;
      downloadLink.download = `${
        selectedMindmap.metadata.name || "mindmap"
      }-${selectedId}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(jsonUrl);

      setInfoMessage("Đã tải mindmap JSON về máy thành công.");
    } catch (error: any) {
      setDetailError("Không thể tải mindmap JSON. Vui lòng thử lại.");
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

      {/* Loading Popup */}
      {creating && (
        <div className="mindmap-edit-modal-overlay">
          <div className="mindmap-loading-popup">
            <div className="mindmap-loading-spinner"></div>
            <h3>Đang tạo mindmap...</h3>
            <p>
              {infoMessage || "AI đang xử lý yêu cầu của bạn. Vui lòng chờ..."}
            </p>
          </div>
        </div>
      )}

      <div className="mindmap-grid">
        <section className="mindmap-card mindmap-list">
          <div className="mindmap-list-header">
            <div>
              <h2>Mindmap của tôi</h2>
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
                  setCreateForm((prev) => ({
                    ...prev,
                    project: e.target.value,
                  }))
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
              {creating ? "Đang tạo..." : "Tạo mindmap"}
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
                <span>Dự án</span>
                <strong>{selectedMindmap.metadata.project || "Chưa có"}</strong>
              </div>
              <div className="mindmap-metadata-item">
                <span>Cập nhật</span>
                <strong>
                  {formatDate(selectedMindmap.metadata.updatedAt)}
                </strong>
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
                    onClick={handleDownloadJSON}
                  >
                    Tải JSON
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

function MindmapTreeView({ mindmap }: { mindmap: ParsedMindmap }) {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [editingNode, setEditingNode] = useState<{
    id: string;
    label: string;
    notes?: string;
  } | null>(null);
  const [editedMindmap, setEditedMindmap] = useState<ParsedMindmap>(mindmap);

  // Sync edited mindmap with props
  useEffect(() => {
    setEditedMindmap(mindmap);
  }, [mindmap]);

  // Convert mindmap tree to ReactFlow nodes and edges
  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeIdCounter = 0;

    function processNode(
      node: MindmapTreeNode,
      depth: number,
      parentId?: string,
      angle?: number,
      radius?: number
    ) {
      const nodeId = `node-${nodeIdCounter++}`;

      // Calculate position (radial layout)
      const rad = angle ?? 0;
      const r = radius ?? 0;
      const x = r * Math.cos(rad);
      const y = r * Math.sin(rad);

      // Determine node style based on depth
      const nodeColors = [
        { bg: "#FDBA1D", border: "#F97316", text: "#0F172A" }, // depth 0
        { bg: "#3B82F6", border: "#1D4ED8", text: "#FFFFFF" }, // depth 1
        { bg: "#38BDF8", border: "#0284C7", text: "#FFFFFF" }, // depth 2
        { bg: "#10B981", border: "#059669", text: "#FFFFFF" }, // depth 3+
      ];
      const colors = nodeColors[Math.min(depth, nodeColors.length - 1)];

      nodes.push({
        id: nodeId,
        type: "default",
        position: { x, y },
        data: {
          label: (
            <div
              style={{ textAlign: "center", padding: "8px", cursor: "pointer" }}
              onDoubleClick={() => {
                setEditingNode({
                  id: nodeId,
                  label: node.label,
                  notes: node.notes,
                });
              }}
              title="Double-click để chỉnh sửa"
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                {node.label}
              </div>
              {node.notes && (
                <div style={{ fontSize: "11px", opacity: 0.8 }}>
                  {node.notes}
                </div>
              )}
            </div>
          ),
          // Store original node data for editing
          _originalNode: node,
        },
        style: {
          background: colors.bg,
          color: colors.text,
          border: `2px solid ${colors.border}`,
          borderRadius: depth === 0 ? "50%" : "12px",
          width: depth === 0 ? 180 : 200,
          height: depth === 0 ? 180 : "auto",
          minHeight: depth === 0 ? 180 : 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: depth === 0 ? "20px" : "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      });

      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: "smoothstep",
          animated: depth <= 1,
          style: { stroke: colors.border, strokeWidth: 2 },
        });
      }

      // Process children in radial layout
      if (node.children && node.children.length > 0) {
        const childRadius = (depth + 1) * 200;
        const startAngle = angle ?? -Math.PI / 2;
        const angleRange = depth === 0 ? Math.PI * 2 : Math.PI / 2;
        const angleStep = angleRange / Math.max(node.children.length, 1);

        node.children.forEach((child, index) => {
          const childAngle = startAngle + angleStep * index;
          processNode(child, depth + 1, nodeId, childAngle, childRadius);
        });
      }
    }

    // Process root node
    if (editedMindmap.roots.length > 0) {
      const rootNode: MindmapTreeNode = {
        id: "root",
        label: editedMindmap.title,
        notes: editedMindmap.description,
        children: editedMindmap.roots,
      };
      processNode(rootNode, 0, undefined, 0, 0);
    }

    return { nodes, edges };
  }, [editedMindmap]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Update nodes/edges when mindmap changes
  useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  const handleSaveEdit = () => {
    if (!editingNode) return;

    // Find the node being edited
    const currentNode = nodes.find((n) => n.id === editingNode.id);
    if (!currentNode) return;

    const originalNode = currentNode.data._originalNode as MindmapTreeNode;

    // Recursive function to update node in tree
    const updateNodeInTree = (node: MindmapTreeNode): MindmapTreeNode => {
      // Check if this is the node we're editing (by reference or id)
      if (node === originalNode || node.id === originalNode?.id) {
        return {
          ...node,
          label: editingNode.label,
          notes: editingNode.notes || undefined,
        };
      }

      // Recursively update children
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: node.children.map(updateNodeInTree),
        };
      }

      return node;
    };

    // Check if editing root node (node-0)
    if (editingNode.id === "node-0") {
      setEditedMindmap({
        ...editedMindmap,
        title: editingNode.label,
        description: editingNode.notes,
      });
    } else {
      // Update children nodes
      const updatedRoots = editedMindmap.roots.map(updateNodeInTree);
      setEditedMindmap({
        ...editedMindmap,
        roots: updatedRoots,
      });
    }

    setEditingNode(null);
  };

  const downloadEditedMindmap = useCallback(() => {
    const exportData = {
      title: editedMindmap.title,
      description: editedMindmap.description,
      nodeTree: editedMindmap.roots,
    };

    const jsonData = JSON.stringify(exportData, null, 2);
    const jsonBlob = new Blob([jsonData], { type: "application/json" });
    const jsonUrl = URL.createObjectURL(jsonBlob);

    const link = document.createElement("a");
    link.download = `${editedMindmap.title || "mindmap"}-edited.json`;
    link.href = jsonUrl;
    link.click();
    URL.revokeObjectURL(jsonUrl);
  }, [editedMindmap]);

  // Update nodes/edges when mindmap changes
  useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  const downloadImage = useCallback(
    async (format: "png" | "svg" = "png") => {
      const nodesBounds = getRectOfNodes(nodes);
      const imageWidth = nodesBounds.width;
      const imageHeight = nodesBounds.height;

      const viewport = document.querySelector(
        ".react-flow__viewport"
      ) as HTMLElement;

      if (!viewport) {
        console.error("Viewport not found");
        return;
      }

      try {
        let dataUrl: string;
        if (format === "png") {
          dataUrl = await toPng(viewport, {
            backgroundColor: "#ffffff",
            width: imageWidth,
            height: imageHeight,
          });
        } else {
          dataUrl = await toSvg(viewport, {
            backgroundColor: "#ffffff",
            width: imageWidth,
            height: imageHeight,
          });
        }

        const link = document.createElement("a");
        link.download = `${mindmap.title || "mindmap"}.${format}`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    },
    [nodes, mindmap.title]
  );

  if (flowNodes.length === 0) {
    return (
      <div className="mindmap-empty-detail">Mindmap chưa có dữ liệu cây.</div>
    );
  }

  return (
    <div className="mindmap-tree mindmap-tree--reactflow">
      <div className="mindmap-tree-header">
        <div>
          <h3>{editedMindmap.title}</h3>
          {editedMindmap.description && (
            <p className="mindmap-tree-description">
              {editedMindmap.description}
            </p>
          )}
        </div>
        <div className="mindmap-tree-controls">
          <button
            type="button"
            className="mindmap-btn primary"
            onClick={downloadEditedMindmap}
            title="Tải về mindmap đã chỉnh sửa"
          >
            📥 Tải JSON đã sửa
          </button>
          <button
            type="button"
            className="mindmap-btn secondary"
            onClick={() => downloadImage("png")}
          >
            Tải PNG
          </button>
          <button
            type="button"
            className="mindmap-btn secondary"
            onClick={() => downloadImage("svg")}
          >
            Tải SVG
          </button>
        </div>
      </div>
      <div className="mindmap-tree-canvas" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls />
          <Panel position="top-right" className="mindmap-panel-info">
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              💡 Double-click node để chỉnh sửa • Kéo thả để di chuyển • Scroll
              để zoom
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Edit Modal */}
      {editingNode && (
        <div
          className="mindmap-edit-modal-overlay"
          onClick={() => setEditingNode(null)}
        >
          <div
            className="mindmap-edit-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mindmap-edit-modal-header">
              <h3>Chỉnh sửa Node</h3>
              <button
                className="mindmap-btn secondary"
                onClick={() => setEditingNode(null)}
              >
                ✕
              </button>
            </div>
            <div className="mindmap-edit-modal-body">
              <div className="mindmap-field">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  value={editingNode.label}
                  onChange={(e) =>
                    setEditingNode({ ...editingNode, label: e.target.value })
                  }
                  autoFocus
                />
              </div>
              <div className="mindmap-field">
                <label>Ghi chú (Optional)</label>
                <textarea
                  value={editingNode.notes || ""}
                  onChange={(e) =>
                    setEditingNode({ ...editingNode, notes: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <div className="mindmap-edit-modal-footer">
              <button
                className="mindmap-btn secondary"
                onClick={() => setEditingNode(null)}
              >
                Hủy
              </button>
              <button className="mindmap-btn primary" onClick={handleSaveEdit}>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
