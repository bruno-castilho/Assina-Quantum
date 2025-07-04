from pqcrypto.sign.ml_dsa_65 import generate_keypair
import base64

# Geração das chaves
public_key, secret_key = generate_keypair()

# Codifica as chaves em Base64 para facilitar leitura/armazenamento
public_key_b64 = base64.b64encode(public_key).decode('utf-8')
secret_key_b64 = base64.b64encode(secret_key).decode('utf-8')

# Salva a chave pública
with open("/home/app/output/public_key.pub", "w") as pub_file:
    pub_file.write(public_key_b64)

# Salva a chave secreta
with open("/home/app/output/secret_key.sec", "w") as sec_file:
    sec_file.write(secret_key_b64)

print("Chaves geradas e salvas com sucesso.")