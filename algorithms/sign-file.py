import base64
import sys
from pqcrypto.sign.ml_dsa_65 import sign

# Verifica se o argumento foi passado
if len(sys.argv) < 2:
    print("Uso: python script.py <nome_do_arquivo>")
    sys.exit(1)

# Nome do arquivo passado por argumento
document_path = sys.argv[1]

# Lê a chave secreta e decodifica de Base64
with open("/home/app/input/secret_key.sec", "r") as key_file:
    secret_key_b64 = key_file.read()
    secret_key = base64.b64decode(secret_key_b64)

# Lê o conteúdo binário do documento
with open(f"/home/app/output/{document_path}", "rb") as file:
    file_data = file.read()

# Assina o documento
signature = sign(secret_key, file_data)

# Codifica a assinatura em Base64 e salva
with open("/home/app/output/signature.sig", "w") as sig_file:
    signature_b64 = base64.b64encode(signature).decode("utf-8")
    sig_file.write(signature_b64)

print("Documento assinado com sucesso. Assinatura salva em: /output/signature.sig")
