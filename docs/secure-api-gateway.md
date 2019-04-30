# Bagaimana cara mengamankan API

Misalkan kita ingin menjaga agar API kita tidak disalah gunakan. kita bisa memanfaatkan fitur usage plan.
Dimana kita bisa membatasi request dari luar ke API kita.


![Alt text](images/usage-plan-api-gateway.png?raw=true "Usage Plan")

- Buka halaman Usage plan pada API Gateway Menu, lalu klik button create usage. disini kita akan mengatur :
  - batasi 1 request perdetik
  - batasi maksimal 5 request berturut turut (burst)
  - batasi kuota 10 kali per hari

![Alt text](images/create-usage-plan-api-gateway.png?raw=true "Usage Plan")

- lanjutkan dengan klik next

![Alt text](images/add-api-stages-api-gateway.png?raw=true "Usage Plan")

Pada halaman ini kita menambahkan api gateway yang ingin kita jaga.

Setelah itu klik tanda centang, dan klik next, jika kita ingin membuat satu client yang di limit maka kita bisa menambahkan api key. seperti dibawah ini

![Alt text](images/add-customer-name-api-gateway.png?raw=true "Usage Plan")

Setup ini fungsinya begini:

Misal kita memeiliki kategori customer kita, sebut saja ```member``` dan ```gold-member```. kita ingin membatasi pengaksesan member menjadi seperti ini:

- batasi 1 request perdetik
- batasi maksimal 5 request berturut turut (burst)
- batasi kuota 10 kali per hari

Lalu untuk gold member:

- batasi 10 request perdetik
- batasi maksimal 50 request berturut turut (burst)
- batasi kuota 100 kali per hari

Atau kita bisa buat menjadi customer name, id customer, dll. intinya semua key yang didaftarkan akan melimitasi request sesuai aturan main kita. Lalu kita kembali ke API gateway kita dan pada endpoint yang kita inginkan, kita setting API Key Required menjadi true.

![Alt text](images/setting-required-api-key.png?raw=true "Setting required API Key")

Disini kita sudah memberikan perintah jika ada yang ingin request ke api kita, harus disertakan API key, lalu kita deplot ulang

![Alt text](images/redeploy-api-gateway.png?raw=true "Redeploy Api Gateway")

Setelah dideploy kita coba akses maka, sekarang sudah tidak bisa diakses atau forbiden

![Alt text](images/test-access-api.png?raw=true "Test API")

Bagaimana caranya agar kita bisa mengakses api, kita harus mengakses menggunakan header tambahan `x-api-key`, dengan api key yang bisa kita ambil di menu api key. klik `show` lalu nanti akan muncul keynya

![Alt text](images/get-api-key-api-gateway.png?raw=true "Get API KEY")

Setelah mendapat api key, bisa kita lakukan request lagi. kali ini kita coba menggunakan postman agar bisa menambahkan header `x-api-key`

![Alt text](images/implement-api-key-using-postman.png?raw=true "Implement API Key")

Sampai disini kita sudah bisa mengakses api mengggunakan api Key

Lalu bagaimana dengan batasan batasan yang tadi kita buat? Oke sekarang kita coba request berkali kali.

![Alt text](images/try-access-many-times.png?raw=true "Try Access Many Times")

Oke sekarang api kita sudah tidak bisa diakses lagi, karena sudah kena rate limit. Dan semua ini sebenernya bisa dilakukan dengan serverles jadi tidak perlu bikin satu satu seperti ini lagi. cek disini [link](https://serverless.com/framework/docs/providers/aws/events/apigateway/#setting-api-keys-for-your-rest-api)

Jadi Usage plans untuk:

- didesain untuk rate limiting, bukan untuk authentication atau authorization
- mengizinkan client untuk mengakses api dan menyetujui atas request rates dan kuota
- usage and plan dapat digunakan untuk semua api

Untuk point nomor 3 maksudnya gini. misal ada api

| api            | stages  | request count |
|----------------|---------|---------------|
| restaurant-api | prod    | 2             |
| restaurant-api | staging | 2             |
| user-api       | staging | 4             |
| user-api       | prod    | 2             |
|                | total   | 10            |

nah rates bisa seperti ini. semua stage bisa ke implement.

Nah kalo mau melakukan authorization, kita bisa menambahkan satu setup lagi yaitu memasang authorizer. untuk saat ini kita akan set ke AWS_IAM.

![Alt text](images/setting-iam-roles.png?raw=true "Setting authorizer to aws iam")

Kita juga bisa membuat custom authentication dan authorization dengan menggunakan custom authorization

![Alt text](images/create-custom-authorizer.png?raw=true "Create custom authorizer")

Di custom authorizer ini, kita bisa membuat sendiri authorizernya, dengan menambahkan arn dari lambda authorizer. atau menggunakan aws cognito.

Cognito adalah service untuk memanage pendaftaran user dan melakukan sinkronisasi user profile ke beberapa device. Kita juga bisa menggunakan cognito user pool untuk membuat user baru. dan memberikan kredensial sementara yang bisa digunakan untuk mengakses AWS resource atau api di api gateway.

Lamda, di aws lambda kita bisa membuat custom authorization dan authenticating user. Fungsi ini akan membaca header request, payload atau query string untuk memvalidasi. Mungkin kaliang sudah tau tentang JWT. nah disini kita akan mengimplementasi JWT. Jadi ketika client membuat permintaan ke api gateway, tapi tidak ada token, lalu api gateway akan memproese di fungsi custom authorization dilambda dan mengembalikan  JSON payload ke client ato bisa aja langsung mengembalikan 403 error `unauthoize`. Disini fungsi lambda authorizer berperan sebagai middleware, setiap request akan melewati dia dulu guna proses pengecekan.

Jika sukses, maka policy akan melakukan cache untuk request selanjutnya. Dan kita juga bisa menggunakan serverless.yml untuk mengatur authorizer ini.

Kesimpulan:

- Kalo butuh rate limit infividual client, kita bisa ginakan api keys dan usage plans.
- Kalo butuh authentikasi kita bisa menggunakan IAM authorization atau bisa gunakan cognito.
- Kalo mau bikin sendiri, kita bisa bikin di aws lambda untuk mengimplement authentication dan authorization.
- Kita juga bisa melakukan cache polict menggunakan fungsi custom authorizer.
- Kita juga bisa mengimplement logic di endpoint itu sendiri. Jadi ada 

ada banyak pilihan  untuk beberapa kasus authentication dan authorization, Dengan adanya authentication authorization, maka akan tercegah dari panggilan ke lambda terus menerus. Tapi tetep aja aws api gateway masih lebih mahal dibanding aws lamda.