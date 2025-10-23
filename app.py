from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

# --- Função auxiliar ---
def conectar():
    return sqlite3.connect('BancoDados.db')

# --- Criar tabela ---
with conectar() as con:
    con.execute('''
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            descricao TEXT,
            imagem TEXT
        )
    ''')

# --- Rota para front-end ---
@app.route('/')
def home():
    return render_template('index.html')

# --- API CRUD ---

@app.route('/produtos', methods=['GET'])
def listar():
    con = conectar()
    cur = con.cursor()
    cur.execute("SELECT * FROM produtos")
    produtos = [
        {"id": r[0], "nome": r[1], "preco": r[2], "descricao": r[3], "imagem": r[4]}
        for r in cur.fetchall()
    ]
    con.close()
    return jsonify(produtos)

@app.route('/produtos', methods=['POST'])
def adicionar():
    data = request.get_json()
    con = conectar()
    cur = con.cursor()
    cur.execute(
        "INSERT INTO produtos (nome, preco, descricao, imagem) VALUES (?, ?, ?, ?)",
        (data['nome'], data['preco'], data.get('descricao', ''), data.get('imagem', ''))
    )
    con.commit()
    con.close()
    return jsonify({"mensagem": "Produto adicionado!"}), 201

@app.route('/produtos/<int:id>', methods=['PUT'])
def atualizar(id):
    data = request.get_json()
    con = conectar()
    cur = con.cursor()
    cur.execute(
        "UPDATE produtos SET nome=?, preco=?, descricao=?, imagem=? WHERE id=?",
        (data['nome'], data['preco'], data.get('descricao', ''), data.get('imagem', ''), id)
    )
    con.commit()
    con.close()
    return jsonify({"mensagem": "Produto atualizado!"})

@app.route('/produtos/<int:id>', methods=['DELETE'])
def excluir(id):
    con = conectar()
    cur = con.cursor()
    cur.execute("DELETE FROM produtos WHERE id=?", (id,))
    con.commit()
    con.close()
    return jsonify({"mensagem": "Produto excluído!"})

if __name__ == '__main__':
    app.run(debug=True)
