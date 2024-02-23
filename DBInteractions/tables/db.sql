-- Users
CREATE TABLE IF NOT EXISTS defaultdb.users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    profile_picture VARCHAR(255),
    biography TEXT,
    location VARCHAR(255),
    date_of_birth DATE,
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    social_media_links VARCHAR(255),
    privacy_settings BOOLEAN DEFAULT TRUE,
    notification_preferences BOOLEAN DEFAULT TRUE,
    verification_status BOOLEAN DEFAULT FALSE,
    moderator_status BOOLEAN DEFAULT FALSE,
    favorite_quotes TEXT,
    interests_tags TEXT,
    activity_history TEXT
);

-- Quotes
CREATE TABLE IF NOT EXISTS defaultdb.quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    quote_text TEXT,
    author VARCHAR(255),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    visibility ENUM('public', 'private') DEFAULT 'public',
    FOREIGN KEY (user_id) REFERENCES defaultdb.users(id)
);

-- Likes
CREATE TABLE IF NOT EXISTS defaultdb.likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    quote_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES defaultdb.users(id),
    FOREIGN KEY (quote_id) REFERENCES defaultdb.quotes(id)
);

-- Comments
CREATE TABLE IF NOT EXISTS defaultdb.comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    quote_id INT,
    comment_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES defaultdb.users(id),
    FOREIGN KEY (quote_id) REFERENCES defaultdb.quotes(id)
);

-- Tags/Categories 
CREATE TABLE IF NOT EXISTS defaultdb.tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(255)
    custom BOOLEAN DEFAULT FALSE
);

-- QuotesTags
CREATE TABLE IF NOT EXISTS defaultdb.quotes_tags (
    quote_id INT,
    tag_id INT,
    PRIMARY KEY (quote_id, tag_id),
    FOREIGN KEY (quote_id) REFERENCES defaultdb.quotes(id),
    FOREIGN KEY (tag_id) REFERENCES defaultdb.tags(id)
);

-- Reports
CREATE TABLE IF NOT EXISTS defaultdb.reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_user_id INT,
    reported_quote_id INT,
    report_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_user_id) REFERENCES defaultdb.users(id),
    FOREIGN KEY (reported_quote_id) REFERENCES defaultdb.quotes(id)
);
