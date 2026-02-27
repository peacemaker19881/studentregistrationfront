<template>
  <div class="comments-container">
    <h2 class="title">💬 Student Comments</h2>

    <!-- STUDENT COMMENT FORM -->
    <div v-if="role === 'student'" class="comment-form">
      <textarea
        v-model="message"
        placeholder="Write your comment here..."
      ></textarea>

      <button @click="sendComment">Send Comment</button>

      <p v-if="successMsg" class="success">{{ successMsg }}</p>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </div>

    <!-- TRAINER VIEW COMMENTS -->
    <div v-if="role === 'trainer'" class="comments-list">
      <div v-if="comments.length === 0" class="empty">
        No comments available
      </div>

      <div v-for="c in comments" :key="c.commentid" class="comment-card">
        <h4>{{ c.fullname }}</h4>
        <p>{{ c.message }}</p>
        <small>{{ formatDate(c.created_at) }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Comments",
  data() {
    return {
      message: "",
      comments: [],
      role: localStorage.getItem("role"),
      successMsg: "",
      errorMsg: ""
    };
  },
  mounted() {
    if (this.role === "trainer") {
      this.fetchComments();
    }
  },
  methods: {
    async sendComment() {
      if (!this.message) {
        this.errorMsg = "Please write a comment first.";
        return;
      }

      try {
        await axios.post(
          "http://localhost:4000/api/comments",
          { message: this.message },
          {
            headers: {
              Authorization: localStorage.getItem("token")
            }
          }
        );

        this.successMsg = "Comment sent successfully 👍";
        this.errorMsg = "";
        this.message = "";
      } catch (err) {
        this.errorMsg = "Failed to send comment";
      }
    },

    async fetchComments() {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/comments",
          {
            headers: {
              Authorization: localStorage.getItem("token")
            }
          }
        );
        this.comments = res.data;
      } catch (err) {
        console.error(err);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    }
  }
};
</script>

<style scoped>
.comments-container {
  max-width: 700px;
  margin: 40px auto;
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

/* COMMENT FORM */
.comment-form textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  font-size: 15px;
}

.comment-form button {
  margin-top: 12px;
  width: 100%;
  padding: 12px;
  background: #2c7be5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.comment-form button:hover {
  background: #1a5fd0;
}

/* COMMENTS LIST */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  border-left: 5px solid #2c7be5;
}

.comment-card h4 {
  margin: 0;
  color: #34495e;
}

.comment-card p {
  margin: 8px 0;
  color: #555;
}

.comment-card small {
  color: #888;
}

/* STATUS MESSAGES */
.success {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}

.empty {
  text-align: center;
  color: #777;
}
</style>
