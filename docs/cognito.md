# Apa itu AWS Cognito?

Apa yang bisa diselesaikan oleh cognito:

- Secure password handling with [SRP](https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol) protocol
- Encrypt all data server-side
- Password Policy
- Token Based Authentication
- [MFA](https://en.wikipedia.org/wiki/Multi-factor_authentication)
- Support Captcha

Tampilan awal Amazon Cognito

![Alt text](images/amazon-cognito.png?raw=true "Amazon Cognito")

Disini kita akan memenanage user pool. Maka tekan tombol manage user pool

![Alt text](images/create-user-pool.png?raw=true "Create user pool")

Setelah diklik didalamnya kita bisa melihat user pool yang sudah dibuat, atau kita bisa membuat baru dengan menekan tombol Create user pool

![Alt text](images/user-pools.png?raw=true "User pool")

Disini kita diberikan 2 pilihan untuk menggunakan default atau kita seting sendiri. Kita akan pilih yang setting sendiri sekalian memperlihatkan fitur fitur yang tersedia. Yang pertama itu membuat atribute.

![Alt text](images/attribute-create-user-pool.png?raw=true "Attribute - Create User pool")

Disini cognito menyediakan pilihan untuk memilih login menggunakan apa?

misal:

- email
- nomor telepon
- username

Oke, sekarang kita pilih email. lalu kita pilih verifikasi email untuk memastikan bahwa email yang dimasukan itu sudah benar.

Kita juga bisa memilih atribute yang diperkukan, kita pilih saja misal email, family name  dan given name. Lebih dari itu kita juga bisa bikin custom atribut, dengan memekan tombol add custom attribute.

Sampai disini kita lajut tekan tombol next.

![Alt text](images/policies-create-user-pool.png?raw=true "Policies - Create User pool")

Disini kita bisa mengatur Policy dari create user kita. semisal kita ingin mengatur kekuatan password, dengan menambahkan kebutuhan minimal password, apa harus terdiri dari nomor, special character, uppercase , lowercase.

Lalu kita juga bisa menambahkan, apakah hanya admin yang bisa menabahkan users, atau users baru bisa mendaftarkan dirinya sendiri.

Kita juga dapat mengatur berapa lama account akan expire, kalo gak digunakan.

Lanjut klik next.

![Alt text](images/mfa-verification-create-user-pool.png?raw=true "MFA & Verification - Create User pool")

Disini dimana kita mengatur MFA, kita bisa memilih untuk menggunakan one time password atau SMS, atau pilih dua duanya.

Tapi kita off kan dulu. Jadi lanjut kita lihat bawahnya, attribute apa yang mau diverify. default kita pilih email saja. jadi nanti user akan menerima email kode verifikasi, untuk melanjutkan registrasi.

![Alt text](images/message-customization-create-user-pool.png?raw=true "Custom Messages - Create User pool")

Dibagian ini kita bisa melakukan kustomisasi kata kata untuk verifikasi. Kita pake default aja, dan lanjut tekan next.

![Alt text](images/devices-create-user-pool.png?raw=true "Devices - Create User pool")

Disini kita harus milih, apakah kita mau mengingat device kita? Pilih tidak dulu.

![Alt text](images/app-client-create-user-pool.png?raw=true "App client - Create User pool")

Pertama-tama kita bikin untuk web atau frontend dulu. Di frontend kita tidak butuh permissiion untuk melakukan penulisan, jadi cukup bisa membaca saja. Masih ada masalah di sdk js karena belum disupport, nanti kita bakal gunain [amplyfy js](https://github.com/aws-amplify/amplify-js). selanjutnya kita buat untuk servernya

![Alt text](images/server-client-create-user-pool.png?raw=true "App client - Create User pool")

Disini caranya teteap sama, tapi kita kasih permission untuk menulis semua atribute. Juga kita enable sign api.

![Alt text](images/trigger-create-user-pool.png?raw=true "App client - Create User pool")

Disini kita bisa mensetup trigger menggunakan lambda. disini ada:

- Pre sign up = memungkinkan kita untuk melakukan verifikasi sebelum pendaftaran
- Custom Message = tadi kita udah liat juga form-form untuk membuat message verifikasi, disini kita bisa menggunakan lambda untuk mengirimnya. Jadi misalkan kalian ingin membuat message secara dinamic, pake nama customer, disini kita bisa lakukan
- Post confirmation = ini tadi kita juga udah liat, kalo kita bisa mengirimkan email atau sms, nah sekarang kita bisa menggunakan sms bukan punya aws, kita bisa gunakan vendor lain. atau email provider lain seperti mailchimp
- Create Auth Challenge = disini kita bisa bikin verifikasi captha menggunakan lambda
- Define Auth Challenge = ini akan dijalankan oleh create auth chalenge
- Verify Auth Challenge Response = cek hasil dari challenge yang didefine
- User Migration = disini juag bisa ngetrigger user migration, semisal kita udah punya user existing untuk di masukan kedalam user pool. Jadi ketika login, kita panggil user migration ini dulu, jika ada usernya akan kita masukan ke user pool
- Pre authentication = ketika submit authentikasi kita bisa melakukan validasi terlebih dulu.
- Post authentication = trigger setelah authentikasi diproses, kita bisa menambahkan locig lagi. misal kita ingin masukan ke anlityc kaya clevertap.
- Pre Token Generation = ini kita bisa gunakan untuk memasukan informasi kedalam token. jadi sebelum proses pembuatan token dijalankan, maka, cognito akan menjalankan ini, sehingga kita bisa memasukan informasi kedalam generator token.

Untuk kali ini kita skip semuanya

![Alt text](images/review-create-user-pool.png?raw=true "Review - Create User pool")

Kita cek kembali apa yang telah kita lakukan, jika sudah oke. tinggal tekan tombol `create pool`

![Alt text](images/finish-create-user-pool.png?raw=true "Review - Create User pool")

selesai sudah pembuatan user pool

Selanjutnya apa? Kita akan mensetup cognito user pool tadi ke api gateway. Lalu apa itu Federated identity

Jadi Federated Identity itu memungkan kita untuk mendapatkan token authorization dari identity providers lainnya. User Pool adalah salah satu identity provider (IP), lainnya kita bisa menggunakan facebook, google atau twitter.

Dari jadi ketika kita login menggunakan salah satu dari IP tersebut, jika valid akan ditukarkan dengan kredensial AWS sementara. 

User Login pakai facebook -> facebook mengembalikan token valid -> kirim ke Cognito Federated Identities -> validate token provider, kalo valid-> balikin aws kredinsial sementara, yang bisa digunakan untuk mengakses AWS services termasuk API gateway yang sudah diprotek oleh authorizer AWS IAM.
 
Terakhir, ada Cognito sync, yang mana mengizinkan kita untuk melakukan sync user profile data ke beberapa device.