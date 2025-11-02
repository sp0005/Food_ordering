import { useEffect, useState } from "react";
import axios from "axios";
import { FiMail, FiUser, FiCalendar } from "react-icons/fi";

const API_URL = "http://localhost/api/contact/get_messages.php";

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.data.success) {
          setMessages(res.data.messages);
        } else {
          console.error(res.data.message);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // auto refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500 animate-pulse">
        Loading messages...
      </p>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No contact messages found.
      </p>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        Contact Messages
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col hover:shadow-lg transition"
          >
            <div className="flex items-center mb-2">
              <FiUser className="text-gray-600 mr-2" />
              <h2 className="font-semibold text-gray-800">{msg.name}</h2>
            </div>
            <div className="flex items-center mb-2">
              <FiMail className="text-gray-600 mr-2" />
              <p className="text-gray-600 truncate">{msg.email}</p>
            </div>
            <div className="flex items-center mb-2">
              <FiCalendar className="text-gray-600 mr-2" />
              <p className="text-gray-500 text-sm">{msg.created_at}</p>
            </div>
            <p className="text-gray-700 mt-2 line-clamp-4">{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContact;
