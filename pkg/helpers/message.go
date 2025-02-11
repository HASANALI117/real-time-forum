package helpers

import (
	"database/sql"
	models "forum/pkg/models"
	"time"

	"github.com/google/uuid"
)

func StoreMessage(db *sql.DB, senderID, receiverID, content string) error {
	id := uuid.New().String()
	_, err := db.Exec(`INSERT INTO messages(id, sender_id, receiver_id, content, created_at)
	VALUES(?, ?, ?, ?, ?)`, id, senderID, receiverID, content, time.Now())
	return err
}

// GetMessages between two users with pagination (last N)
func GetMessages(db *sql.DB, userA, userB string, limit, offset int) ([]models.Message, error) {
	rows, err := db.Query(`
		SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at, us.username, us.image
		FROM messages m
		JOIN users us ON m.sender_id = us.id
		WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
		ORDER BY m.created_at DESC LIMIT ? OFFSET ?
	`, userA, userB, userB, userA, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var msgs []models.Message
	for rows.Next() {
		var msg models.Message
		err := rows.Scan(&msg.ID, &msg.SenderID, &msg.ReceiverID, &msg.Content, &msg.CreatedAt, &msg.SenderName, &msg.SenderImage)
		if err != nil {
			return nil, err
		}
		msgs = append(msgs, msg)
	}
	// messages are in DESC order, reverse them
	for i, j := 0, len(msgs)-1; i < j; i, j = i+1, j-1 {
		msgs[i], msgs[j] = msgs[j], msgs[i]
	}
return msgs, nil
}

// GetLatestMessageBetweenUsers gets the most recent message between the current user and another user
func GetLatestMessageBetweenUsers(db *sql.DB, userA, userB string) (*models.Message, error) {
    var msg models.Message
    err := db.QueryRow(`
        SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at, us.username, us.image
        FROM messages m
        JOIN users us ON m.sender_id = us.id
        WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.created_at DESC LIMIT 1
    `, userA, userB, userB, userA).Scan(&msg.ID, &msg.SenderID, &msg.ReceiverID, &msg.Content, &msg.CreatedAt, &msg.SenderName, &msg.SenderImage)
    if err == sql.ErrNoRows {
        return nil, nil
    }
    if err != nil {
        return nil, err
    }
    return &msg, nil
}

func GetTotalMessagesCount(db *sql.DB, userA, userB string) (int, error) {
	var count int
	err := db.QueryRow(`
		SELECT COUNT(*)
		FROM messages
		WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
	`, userA, userB, userB, userA).Scan(&count)
	return count, err
}

func GetAllMessages(db *sql.DB) ([]models.Message, error) {
	rows, err := db.Query(`
		SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at, us.username, us.image
		FROM messages m
		JOIN users us ON m.sender_id = us.id
		ORDER BY m.created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var msgs []models.Message
	for rows.Next() {
		var msg models.Message
		err := rows.Scan(&msg.ID, &msg.SenderID, &msg.ReceiverID, &msg.Content, &msg.CreatedAt, &msg.SenderName, &msg.SenderImage)
		if err != nil {
			return nil, err
		}
		msgs = append(msgs, msg)
	}
	for i, j := 0, len(msgs)-1; i < j; i, j = i+1, j-1 {
		msgs[i], msgs[j] = msgs[j], msgs[i]
	}
	return msgs, nil
}
