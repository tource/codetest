import React, { useEffect, useState } from "react";
import api from "../utils/axios";

interface BoardWriteFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  editMode?: boolean;
  postId?: number;
  initialData?: {
    title: string;
    content: string;
    category: string;
  };
}

const BoardWrite: React.FC<BoardWriteFormProps> = ({
  onCancel,
  onSuccess,
  editMode = false,
  postId,
  initialData,
}) => {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get<Record<string, string>>("/boards/categories");
      setCategories(res.data);
      if (!editMode) {
        const firstKey = Object.keys(res.data)[0];
        setForm((prev) => ({ ...prev, category: firstKey }));
      }
    } catch (err) {
      alert("카테고리를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(form)], { type: "application/json" })
    );
    if (file) {
      formData.append("file", file);
    }

    try {
      if (editMode && postId) {
        await api.patch(`/boards/${postId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("글이 수정되었습니다.");
      } else {
        await api.post("/boards", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("글이 작성되었습니다.");
      }
      onSuccess();
    } catch (err) {
      setError("작업에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className="free-list">카테고리를 불러오는 중...</div>;
  }

  return (
    <div className="free-wrap">
      <div className="free-card">
        <form onSubmit={handleSubmit} className="free-list">
          <h2 className="free-title">{editMode ? "글 수정" : "글쓰기"}</h2>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="search-filter-select"
            required
          >
            {Object.entries(categories).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="title"
            placeholder="제목을 입력하세요"
            value={form.title}
            onChange={handleChange}
            className="search-input2"
            required
          />

          <textarea
            name="content"
            placeholder="내용을 입력하세요"
            value={form.content}
            onChange={handleChange}
            className="search-input2"
            rows={10}
            required
          />

          <input type="file" onChange={handleFileChange} />

          {error && <div className="auth-error">{error}</div>}

          <div className="free-button-box">
            <button type="submit" className="free-write-button">
              {editMode ? "수정" : "등록"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="free-page-button"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardWrite;
