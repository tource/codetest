import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import BoardWrite from "../components/BoardWrite";

interface Post {
  id: number;
  title: string;
  category: string;
  createdAt: string;
}

const POSTS_PER_PAGE = 10;

const BoardPage = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const handleAuthError = (err: any) => {
    if (err.response?.status === 403) {
      alert("로그인이 필요한 기능입니다.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get<Record<string, string>>("/boards/categories");
      setCategories(res.data);
    } catch (err) {
      handleAuthError(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get<{ content: Post[] }>("/boards", {
        params: {
          page: 0,
          size: 100,
        },
      });
      setAllPosts(res.data.content);
    } catch (err) {
      handleAuthError(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategories();
      fetchPosts();
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (selectedCategory === "") {
      setFilteredPosts(allPosts);
    } else {
      setFilteredPosts(
        allPosts.filter((post) => post.category === selectedCategory)
      );
    }
    setPage(0);
  }, [selectedCategory, allPosts]);

  const paginatedPosts = filteredPosts.slice(
    page * POSTS_PER_PAGE,
    (page + 1) * POSTS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`free-page-button ${i === page ? "active-page" : ""}`}
          onClick={() => setPage(i)}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="free-wrap">
      <div className="free-card">
        <div className="board-tab-header">
          <select
            className="search-filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">전체</option>
            {Object.entries(categories).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {!showWriteForm && (
            <button
              className="free-write-button"
              onClick={() => setShowWriteForm(true)}
            >
              글쓰기
            </button>
          )}
        </div>

        <div className="free-section">
          {showWriteForm ? (
            <BoardWrite
              onCancel={() => setShowWriteForm(false)}
              onSuccess={() => {
                setShowWriteForm(false);
                fetchPosts();
              }}
            />
          ) : (
            <>
              <div className="free-list">
                {paginatedPosts.length === 0 ? (
                  <div>게시글이 없습니다.</div>
                ) : (
                  paginatedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="free-list-item"
                      onClick={() => navigate(`/board/detail/${post.id}`)}
                    >
                      <div className="free-item-title">
                        [{categories[post.category] || post.category}]{" "}
                        {post.title}
                      </div>
                      <div className="free-item-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="free-pagination">
                <button
                  className="free-page-button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                >
                  이전
                </button>

                {renderPageNumbers()}

                <button
                  className="free-page-button"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={page + 1 >= totalPages}
                >
                  다음
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
