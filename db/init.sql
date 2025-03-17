CREATE TABLE "Logins"(
    login varchar NOT NULL,
    hash varchar,
    salt varchar,
    CONSTRAINT "PK_Login" PRIMARY KEY (login)
);

CREATE TABLE "UserProfiles"(
    login varchar NOT NULL,
    first_name varchar,
    last_name varchar,
    info varchar,
    email varchar,
    phone varchar,
    file uuid NULL,
    CONSTRAINT "PK_UserProfile" PRIMARY KEY (login)
);

CREATE TABLE "Files"(
    id uuid NOT NULL,
    filename varchar NOT NULL,
    mime_type varchar,
    CONSTRAINT "PK_File" PRIMARY KEY (id)
);

CREATE TABLE "Comments"(
    id SERIAL PRIMARY KEY,
    message varchar,
    author varchar,
    publish_at TIMESTAMP
);

CREATE TABLE "CommentFiles"(
    "commentId" integer NOT NULL,
    "fileId" uuid NOT NULL,
	CONSTRAINT "PK_CommentFiles" PRIMARY KEY ("commentId","fileId"),
    CONSTRAINT "FK_CommentFiles_Comments" FOREIGN KEY ("commentId") REFERENCES "Comments" (id),
    CONSTRAINT "FK_CommentsFiles_Files" FOREIGN KEY ("fileId") REFERENCES "Files" (id)
);

INSERT INTO "Logins"(login, hash, salt)
VALUES ('user1', '8e2e9f45be9f2281a43b471677ed8ed0ff35432630474497b9ed762957fb2ba8a53cfe9fe67cb0142335448c93ec4bc61d2766a372dfb97bef77a46ca2392bed', '4844acc213992db08b6c8a5182afb444');

INSERT INTO "UserProfiles"(first_name, last_name, email, phone, info, login)
VALUES ('Иван', 'Иванов', 'test@example.com', '+79999999999', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'user1');


INSERT INTO "Comments"(message, publish_at, author)
VALUES ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '2025-03-13 18:30:20','user1');
