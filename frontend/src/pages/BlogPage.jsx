import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import { FontSize } from "../extensions/FontSize";

const PREDEFINED = ["Verein", "DIY-Park", "Szene"];

export default function BlogPage() {
  const { loggedIn, user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [categories, setCategories] = useState([...PREDEFINED]);
  const [filter, setFilter] = useState("Alle");
  const editorImageInput = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize, Image],
    content: "",
  });

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:3001/api/blogs");
      const data = await res.json();
      setPosts(data);
      setCategories(
        Array.from(new Set([...PREDEFINED, ...data.map((p) => p.category)]))
      );
    }
    load();
  }, []);

  const visiblePosts = posts
    .filter((p) => filter === "Alle" || p.category === filter)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handleEditorImageUpload = async (event) => {
    const img = event.target.files[0];
    if (!img || !editor) return;
    const form = new FormData();
    form.append("image", img);
    const res = await fetch("http://localhost:3001/api/uploads", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (data.imageUrl) {
      editor.chain().focus().setImage({ src: data.imageUrl }).run();
    }
  };

  const handleCreate = async () => {
    const content = editor.getHTML();
    const form = new FormData();
    form.append("title", title);
    form.append("content", content);
    form.append("category", category || PREDEFINED[0]);
    if (file) form.append("file", file);
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3001/api/blogs", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (res.ok) {
      setPosts([data.post, ...posts]);
      setTitle("");
      setCategory("");
      setFile(null);
      editor.commands.setContent("");
      setShowEditor(false);
      setFeedback("Beitrag erfolgreich veröffentlicht.");
    } else {
      setFeedback("Fehler beim Hochladen.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Möchtest du diesen Beitrag wirklich löschen?")) return;
    const res = await fetch(`http://localhost:3001/api/blogs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setPosts(posts.filter((p) => p.id !== id));
    } else {
      alert("Löschen fehlgeschlagen.");
    }
  };

  function EditPost({ post, onCancel, onSave }) {
    const editImageInput = useRef(null);
    const eEditor = useEditor({
      extensions: [StarterKit, TextStyle, FontSize, Image],
      content: post.content,
    });
    const [t, setT] = useState(post.title);
    const [cat, setCat] = useState(post.category);
    const [newFile, setNewFile] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
      const token = localStorage.getItem("token");
      const content = eEditor.getHTML();
      const form = new FormData();
      form.append("title", t);
      form.append("content", content);
      form.append("category", cat);
      if (newFile) form.append("file", newFile);
      setSaving(true);
      const res = await fetch(`http://localhost:3001/api/blogs/${post.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      setSaving(false);
      if (res.ok) onSave();
      else alert("Fehler beim Speichern.");
    };

    return (
      <div className="border p-4 rounded bg-white/95 space-y-4">
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={t}
          onChange={(e) => setT(e.target.value)}
        />
        <div className="flex space-x-2">
          <input
            list="edit-cats"
            className="border px-2 py-1 rounded"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          />
          <datalist id="edit-cats">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div className="flex space-x-2 mb-2">
          <button
            onClick={() => eEditor.chain().focus().toggleBold().run()}
            className="px-2 font-bold"
          >
            F
          </button>
          <button
            onClick={() => eEditor.chain().focus().toggleItalic().run()}
            className="px-2 italic"
          >
            K
          </button>
          <label className="px-2">Schriftgröße:</label>
          <select
            onChange={(e) =>
              eEditor.chain().focus().setFontSize(e.target.value).run()
            }
            defaultValue="16px"
            className="border rounded px-2"
          >
            <option value="12px">12</option>
            <option value="16px">16</option>
            <option value="20px">20</option>
            <option value="24px">24</option>
            <option value="32px">32</option>
          </select>
          <button
            onClick={() => editImageInput.current.click()}
            className="px-2"
          >
            Img
          </button>
          <input
            type="file"
            ref={editImageInput}
            onChange={handleEditorImageUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
        <div className="border border-gray-300 rounded p-2 bg-white">
          <EditorContent editor={eEditor} />
        </div>
        {post.imageUrl && !/\.(jpe?g|png|gif)$/i.test(post.imageUrl) && (
          <div className="mb-2">
            <strong>Anhang:</strong>{" "}
            <a
              href={`http://localhost:3001${post.imageUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {post.imageUrl.split("/").pop()}
            </a>
          </div>
        )}
        <input
          type="file"
          onChange={(e) => setNewFile(e.target.files[0])}
          accept=".pdf,.doc,.docx"
          className="block"
        />
        <div className="space-x-2">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={saving}
          >
            Speichern
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Abbrechen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <h1 className="text-3xl font-extrabold mb-4">
          <span className="bg-white/95 px-2 py-1 text-orange-500">Blog</span>
        </h1>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-white/95 px-2 py-1 text-orange-500">
              Kategorie auswählen:
            </span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border px-2 py-1 bg-white/95"
            >
              <option>Alle</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          {loggedIn && (
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              + Neuer Beitrag
            </button>
          )}
        </div>

        {showEditor && (
          <div className="border p-4 rounded-lg mb-6 bg-gray-50 space-y-2">
            <input
              type="text"
              placeholder="Titel"
              className="w-full border px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex space-x-2">
              <label className="px-2">Kategorie auswählen:</label>
              <input
                list="new-cats"
                className="border px-2 py-1 rounded"
                placeholder="Kategorie"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <datalist id="new-cats">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="flex space-x-2 mb-2">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className="px-2 font-bold"
              >
                F
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className="px-2 italic"
              >
                K
              </button>
              <label className="px-2">Schriftgröße:</label>
              <select
                onChange={(e) =>
                  editor.chain().focus().setFontSize(e.target.value).run()
                }
                defaultValue="16px"
                className="border rounded px-2"
              >
                <option value="12px">12</option>
                <option value="16px">16</option>
                <option value="20px">20</option>
                <option value="24px">24</option>
                <option value="32px">32</option>
              </select>
              <button
                onClick={() => editorImageInput.current.click()}
                className="px-2"
              >
                Img
              </button>
              <input
                type="file"
                ref={editorImageInput}
                onChange={handleEditorImageUpload}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            <div className="border p-2 rounded bg-white">
              <EditorContent editor={editor} />
            </div>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.doc,.docx,image/*"
              className="block"
            />
            <button
              onClick={handleCreate}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Veröffentlichen
            </button>
            {feedback && <p className="text-sm mt-1">{feedback}</p>}
          </div>
        )}

        <ul className="space-y-6">
          {visiblePosts.map((post) =>
            editingPostId === post.id ? (
              <EditPost
                key={post.id}
                post={post}
                onCancel={() => setEditingPostId(null)}
                onSave={() => {
                  setEditingPostId(null);
                  fetch("http://localhost:3001/api/blogs")
                    .then((r) => r.json())
                    .then((d) => setPosts(d));
                }}
              />
            ) : (
              <li key={post.id} className="border p-4 bg-white/95">
                <h2 className="text-xl font-bold mb-1 text-orange-500">
                  {post.title}
                </h2>
                <p className="text-sm italic mb-2">{post.category}</p>
                <div
                  className="prose max-w-none mb-2"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                {post.imageUrl && /\.(jpe?g|png|gif)$/i.test(post.imageUrl) ? (
                  <img
                    src={`http://localhost:3001${post.imageUrl}`}
                    className="w-full rounded mb-2"
                  />
                ) : post.imageUrl ? (
                  <div className="mb-2">
                    <strong>Anhang:</strong>{" "}
                    <a
                      href={`http://localhost:3001${post.imageUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {post.imageUrl.split("/").pop()}
                    </a>
                  </div>
                ) : null}
                {(user?.role === "moderator" || user?.role === "admin") && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setEditingPostId(post.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      ✏️ Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      🗑 Löschen
                    </button>
                  </div>
                )}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
