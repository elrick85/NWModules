openssl smime -encrypt -binary -des3 -in ../../test/app/index.html -out ../../test/index.enc -outform DER ../../test/keys/public.pem

openssl smime -decrypt -binary -des3 -in ../../test/index.enc -inform DER -out ../../test/index.dec.html -inkey ../../test/keys/private.pem -passin pass:elrick

0. ������� ����� ������.
1. ��������� �������� ���� (����� ������)
2. ����������� �� ���� ���� ����� (���������� ����������)
3. ����������� ���� �� RSA (����������� ����������)
4. �������� ������������� RSA ���� � �������������� ������.
5. ��������� ���� ������������.