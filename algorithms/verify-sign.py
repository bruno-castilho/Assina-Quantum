import base64
from pqcrypto.sign.ml_dsa_65 import verify
import sys

# Verifica se o argumento foi passado
if len(sys.argv) < 2:
    print("Uso: python script.py <nome_do_arquivo>")
    sys.exit(1)

# Nome do arquivo passado por argumento
document_path = sys.argv[1]

# Lê e decodifica a chave pública
with open("/key/public_key.pub", "r") as pub_file:
    public_key_b64 = pub_file.read()
    public_key = base64.b64decode(public_key_b64)

# Lê o conteúdo do PDF original
with open(f"/home/app/files/{document_path}", "rb") as document:
    pdf_data = document.read()

# Lê e decodifica a assinatura
with open("/home/app/files/signature.sig", "r") as sig_file:
    signature_b64 = sig_file.read()
    signature = base64.b64decode(signature_b64)

# Verifica a assinatura
assert verify(public_key, pdf_data, signature)
print("✅ Assinatura válida.")
