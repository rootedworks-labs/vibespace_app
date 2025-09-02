/**
 * Creates a new report for a piece of content.
 */
const { query } = require('../db');
exports.createReport = async (req, res) => {
    const { userId: reporter_id } = req;
    const { reported_content_type, reported_id, reason } = req.body;

    try {
        // Optional: Verify the reported content exists before creating a report
        let contentExists = false;
        if (reported_content_type === 'post') {
            const post = await query('SELECT id FROM posts WHERE id = $1', [reported_id]);
            if (post.rows.length > 0) contentExists = true;
        } else if (reported_content_type === 'comment') {
            const comment = await query('SELECT id FROM comments WHERE id = $1', [reported_id]);
            if (comment.rows.length > 0) contentExists = true;
        } else {
            return res.status(400).json({ error: 'Invalid content type.' });
        }

        if (!contentExists) {
            return res.status(404).json({ error: 'The content you are trying to report does not exist.' });
        }

        const newReport = await query(
            'INSERT INTO reports (reporter_id, reported_content_type, reported_id, reason) VALUES ($1, $2, $3, $4) RETURNING *',
            [reporter_id, reported_content_type, reported_id, reason]
        );

        res.status(201).json(newReport.rows[0]);
    } catch (err) {
        console.error('Create report error:', err);
        res.status(500).json({ error: 'Server error while creating report.' });
    }
};

/**
 * Retrieves all open reports for admin review.
 */
exports.getOpenReports = async (req, res) => {
    try {
        const { rows } = await query(
            `SELECT r.id, r.status, r.reason, r.created_at, r.reported_content_type, r.reported_id, u.username as reporter_username
             FROM reports r
             JOIN users u ON r.reporter_id = u.id
             WHERE r.status = 'open'
             ORDER BY r.created_at ASC`
        );
        res.status(200).json(rows);
    } catch (err) {
        console.error('Get open reports error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.updateReportStatus = async (req, res) => {
  const { reportId } = req.params;
  const { status } = req.body;

  try {
    const result = await query(
      "UPDATE reports SET status = $1 WHERE id = $2 RETURNING *",
      [status, reportId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Update report status error:', err);
    res.status(500).json({ error: 'Server error while updating report status.' });
  }
};