import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      setErrorMessage("Error fetching posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      setErrorMessage("Error fetching users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!title || !content || !userId) {
      setErrorMessage("يرجى ملء جميع الحقول!");
      return;
    }

    try {
      await axios.post(`${API_URL}/posts`, { title, content, user: userId });
      fetchPosts();
      setTitle("");
      setContent("");
      setUserId("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error adding post. Please try again.");
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`${API_URL}/posts/${id}`);
      fetchPosts();
    } catch (error) {
      setErrorMessage("Error deleting post. Please try again.");
    }
  };

  const handleAddUser = async () => {
    if (!newUserName || !newUserEmail) {
      setErrorMessage("يرجى إدخال اسم المستخدم والبريد الإلكتروني!");
      return;
    }

    if (!validateEmail(newUserEmail)) {
      setErrorMessage("البريد الإلكتروني غير صالح!");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users`, {
        username: newUserName,
        email: newUserEmail,
      });

      setUsers([...users, response.data]);
      setNewUserName("");
      setNewUserEmail("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error adding user. Please try again.");
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>إدارة المنشورات</h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <h3>إضافة مستخدم جديد:</h3>
      <input
        type="text"
        placeholder="الاسم"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
      />
      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={newUserEmail}
        onChange={(e) => setNewUserEmail(e.target.value)}
      />
      <button onClick={handleAddUser}> إضافة مستخدم</button>

      <h3>إضافة منشور جديد:</h3>
      <input
        type="text"
        placeholder="عنوان المنشور"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="المحتوى"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <select value={userId} onChange={(e) => setUserId(e.target.value)}>
        <option value="">اختر مستخدمًا</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.username}
          </option>
        ))}
      </select>
      <button onClick={handleAddPost}> إضافة منشور</button>

      <h3>جميع المنشورات:</h3>
      {isLoading ? (
        <p>جارٍ التحميل...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <strong>{post.title}</strong> - {post.content} (بواسطة {post.user?.username || "مجهول"})
              <button onClick={() => handleDeletePost(post._id)}> حذف</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

