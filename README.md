# Student Grade Management System (AES-256-GCM Encrypted)

A lightweight Node.js command-line application designed to securely collect, encrypt, persist, and decrypt student records (names and module grades) using authenticated symmetric encryption (**AES-256-GCM**).

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Security & Cryptography](#-security--cryptography)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
  - [1. Add / Encrypt Student Data (`ajouter.js`)](#1-add--encrypt-student-data-ajouterjs)
  - [2. View / Decrypt Student Data (`afficher.js`)](#2-view--decrypt-student-data-afficherjs)
- [Data Storage Format](#-data-storage-format)
- [Security Best Practices](#-security-best-practices)

---

## 🔍 Overview

This project demonstrates practical cryptography in Node.js for data protection at rest:
- **Interactive CLI Input**: Prompts the user in terminal for a student's name and their modules/grades.
- **AES-256-GCM Encryption**: Encrypts sensitive fields independently with uniquely generated initialization vectors (IVs) and authentication tags.
- **Persistence**: Writes the encrypted ciphertext, IVs, and authentication tags to `etudiant.json`.
- **Decryption & Verification**: Reads and authenticates encrypted data using the pre-shared secret key, alerting if any data tampering has occurred.

---

## 🔐 Security & Cryptography

The application implements the **Advanced Encryption Standard (AES)** in **Galois/Counter Mode (GCM)** (`aes-256-gcm`):

- **Algorithm**: `AES-256-GCM` (Authenticated Encryption with Associated Data - AEAD).
- **Key Length**: 256 bits (32 bytes), formatted as a 64-character hexadecimal string in `.env`.
- **Initialization Vector (IV)**: A unique 96-bit (12 bytes) random IV (`crypto.randomBytes(12)`) is generated for every encryption operation to prevent replay attacks and pattern recognition.
- **Integrity & Authenticity**: A 128-bit authentication tag (`authTag`) is produced by the cipher. During decryption, `decipher.setAuthTag()` ensures that the ciphertext was not altered or corrupted.

---

## 📁 Project Structure

```text
.
├── .env                # Environment configuration holding SECRET_KEY (not to be committed)
├── .env.example        # Example environment template
├── ajouter.js          # CLI script to collect, encrypt, and save student information
├── afficher.js         # Script to read, decrypt, and display saved records
├── etudiant.json       # JSON file containing encrypted data payloads
├── package.json        # Node.js project manifest and dependencies
└── README.md           # Documentation
```

---

## ⚙️ Prerequisites

- **Node.js**: Version `18.0.0` or higher (tested on Node.js `v22+`).
- **npm**: Node package manager.

---

## 🚀 Installation & Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd amel
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   Generate a secure 32-byte (256-bit) random key encoded in hexadecimal:
   ```bash
   node -e "console.log(crypto.randomBytes(32).toString('hex'))"
   ```
   Copy the generated 64-character string and set it in your `.env` file:
   ```env
   SECRET_KEY=your_generated_64_character_hex_key_here
   ```

---

## 💻 Usage

### 1. Add / Encrypt Student Data (`ajouter.js`)

Run the script to enter student information interactively:

```bash
node ajouter.js
```

You will be prompted for:
1. **Nom**: The student's name (e.g., `Amel`).
2. **Module**: The subject/course name (e.g., `Math`).
3. **Note**: The student's grade (e.g., `18`).
4. Enter additional modules and grades as prompted. Leave the `Module` field blank and press `Enter` to finalize entry.

Once finished, the data is encrypted and written to `etudiant.json`.

---

### 2. View / Decrypt Student Data (`afficher.js`)

Run the script to read and decrypt the contents of `etudiant.json`:

```bash
node afficher.js
```

The script will:
1. Load `SECRET_KEY` from the environment.
2. Read `etudiant.json`.
3. Decrypt the student name (`hash_nom`) and the grade transcript array (`hash_note`).
4. Output the decrypted name and grade details to the console.

---

## 📄 Data Storage Format

The generated `etudiant.json` stores encrypted payloads with their respective IV and authentication tags:

```json
{
  "hash_nom": {
    "iv": "c7a5c8535cd7502421c16bb4",
    "encryptedData": "f7...",
    "authTag": "7ab23d7d08e59ca2e88f59679ba97d8b"
  },
  "hash_note": {
    "iv": "a887181bcf037f9936543741",
    "encryptedData": "2f9c4b2ab0d0...",
    "authTag": "7d8131c8307fa6ae092861381d0be578"
  }
}
```

- `iv`: Hexadecimal string of the 12-byte random initialization vector.
- `encryptedData`: Hexadecimal ciphertext.
- `authTag`: Hexadecimal string of the 16-byte authentication tag ensuring integrity.

---

## 🔒 Security Best Practices

1. **Protect `.env`**: Never commit `.env` or expose your `SECRET_KEY` to public version control repositories (e.g., GitHub).
2. **Key Rotation**: If `SECRET_KEY` is compromised, existing stored data must be re-encrypted under a new key.
3. **Always Check Key Length**: The key must be exactly 32 bytes (256 bits). The script validates this upon initialization:
   ```javascript
   if (secretKey.length !== 32) {
       throw new Error('SECRET_KEY must be exactly 32 bytes!');
   }
   ```
