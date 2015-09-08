openssl smime -encrypt -binary -des3 -in ../../test/app/index.html -out ../../test/index.enc -outform DER ../../test/keys/public.pem

openssl smime -decrypt -binary -des3 -in ../../test/index.enc -inform DER -out ../../test/index.dec.html -inkey ../../test/keys/private.pem -passin pass:elrick

0. Создать архив файлов.
1. Сгенерить слчайный ключ (набор байтов)
2. Зашифровать на этот ключ архив (синхронное шифрование)
3. Зашифровать ключ на RSA (асинхронное шифрование)
4. Добавить зашифрованный RSA ключ к зашифрованному архиву.
5. Подписать файл сертификатом.