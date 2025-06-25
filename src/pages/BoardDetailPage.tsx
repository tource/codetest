import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import BoardWriteForm from "../components/BoardWrite";

interface BoardDetail {
  id: number;
  title: string;
  content: string;
  boardCategory: string;
  imageUrl?: string;
  createdAt: string;
}

const BoardDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<BoardDetail | null>(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  const fetchDetail = async () => {
    try {
      const res = await api.get<BoardDetail>(`/boards/${id}`);
      setDetail(res.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("로그인이 필요한 기능입니다.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      } else {
        setError("게시글을 불러오는 데 실패했습니다.");
      }
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/boards/${id}`);
      alert("삭제되었습니다.");
      navigate("/boards");
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (!editMode) {
      fetchDetail();
    }
  }, [id, editMode]);

  if (error) return <div className="detail-error">{error}</div>;
  if (!detail) return <div className="detail-loading">로딩 중...</div>;

  if (editMode && detail) {
    return (
      <BoardWriteForm
        editMode
        postId={detail.id}
        initialData={{
          title: detail.title,
          content: detail.content,
          category: detail.boardCategory,
        }}
        onCancel={() => setEditMode(false)}
        onSuccess={() => {
          setEditMode(false);
          fetchDetail();
        }}
      />
    );
  }

  return (
    <div className="board-detail-wrap">
      <div className="board-detail-card">
        <div className="board-detail-header">
          <div className="board-detail-category">[{detail.boardCategory}]</div>
          <div className="board-detail-title">{detail.title}</div>
          <div className="board-detail-date">
            {new Date(detail.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="board-detail-content">{detail.content}</div>

        {detail.imageUrl && (
          <div className="board-detail-image">
            <img
              src={`https://front-mission.bigs.or.kr${detail.imageUrl}`}
              alt="첨부 이미지"
            />
          </div>
        )}

        <div className="board-detail-actions">
          <button
            className="free-write-button"
            onClick={() => setEditMode(true)}
          >
            수정
          </button>
          <button className="free-delete-button" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
