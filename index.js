// Import modul yang diperlukan
const { DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { text } = require('express');
const makeWASocket = require('@whiskeysockets/baileys').default;

async function connectionLogic() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        // Konfigurasi tambahan bisa ditambahkan di sini
        printQRInTerminal: true,
        auth: state
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update || {};

        if (qr) {
            console.log(qr);
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Reconnecting...');
                connectionLogic(); // Recursively call the connection logic to reconnect
            } else {
                console.log('Connection closed and not reconnecting');
            }
        } else if (connection === 'open') {
            console.log('Connection opened');
        }
    });

    sock.ev.on('messages.update', (messageInfo) => {
        // Iterate through each message in the array
        messageInfo.forEach((message) => {
            // Access each message and its properties
            console.log('pesan =>', message.message);
            console.log('pesan2 =>', (message.key))
            console.log('pesan3 =>', message.pushName);

            // Cek jika pesan adalah "hello"
            if (message.message && message.message.toLowerCase() === 'hello') {
                // Balas pesan dengan "hai"
                sock.sendMessage(message.key.remoteJid, 'Hai!');
            }
        });
    });
    // Event listener untuk pesan yang diupdate
    sock.ev.on('messages.upsert', (messageInfoUpsert) => {
        // Iterate through each message in the array
        messageInfoUpsert.messages.forEach((message) => {
            // Print message details
            console.log('pesan4 =>');
            console.log('Key:', message.key);
            console.log('Timestamp:', message.messageTimestamp);
            console.log('Push Name:', message.pushName);
            console.log('Broadcast:', message.broadcast);
            console.log('Verified Biz Name:', message.verifiedBizName);

            // Jika message.message memiliki conversation, maka print conversation
            if (message.message && message.message.conversation) {
                console.log('Message Conversation:', message.message.conversation);
                // Jika pesan adalah "Halo! Bisakah saya mendapatkan info selengkapnya tentang ini?"
                if (message.message.conversation.toLocaleLowerCase() === 'info') {
                    // Format pesan untuk dikirim
                    const responseMessage1 = {
                        text: '*Hallo, saya Rocket Bot🚀 Asisten kamu*.\nBerikut kumpulan informasi yang sudah kami siapkan'
                    };

                    // Kirim pesan
                    sock.sendMessage(message.key.remoteJid, responseMessage1);

                    setTimeout(() => {
                        // Kirim pesan kedua
                        const responseMessage2 = {
                            text: "Silakan pilih angka di bawah ini:\n*1️⃣. Visi dan Misi Malahayati Consultant*\n*2️⃣. Legalitas Perusahaan*\n*3️⃣. 4 Keuntungan yang diraup oleh PINJOL*\n*4️⃣. Sistem Pengerjaan di Kantor*\n*5️⃣. Sistem pengerjaan di luar kota*\n*6️⃣. Jika sudah galbay apakah masih bisa?*\n*7️⃣. Berapa Ongkos Jasanya?*\n*8️⃣. Alamat Kantor dimasing-masing kota*\n*9️⃣. Isi Formulir Pendaftaran*"
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage2);
                    }, 500);
                }
                // Jika pesan adalah "1"
                else if (message.message.conversation === '1') {
                    // Kirim gambar yang telah disiapkan
                    const responseMessage1 = {
                        text: 'VISI\nPT. Malahayati Nusantara Raya menjadi perusahaan penyedia Jasa Konsultan Keuangan yang mengedepankan Transparansi, Edukasi, dan Integritas serta memberantas Hama Fintech yang meresahkan, mengatasi permasalahan di Lembaga pembiayaan dengan jalur diplomasi yang terukur dan terarah.\n\n*MISI*\nMencerdaskan sesama dengan metode ESRF (Excelent Strategy Of Reach Fintech) guna meminimalisir tingkat Fraud berbasis On Line di berbagai lembaga pembiayaan.'

                    };
                    sock.sendMessage(message.key.remoteJid, responseMessage1, { quoted: message });
                    setTimeout(() => {
                        // Kirim pesan kedua
                        const responseMessage2 = {
                            text: "Silakan pilih angka di bawah ini:\n*1️⃣. Visi dan Misi Malahayati Consultant*\n*2️⃣. Legalitas Perusahaan*\n*3️⃣. 4 Keuntungan yang diraup oleh PINJOL*\n*4️⃣. Sistem Pengerjaan di Kantor*\n*5️⃣. Sistem pengerjaan di luar kota*\n*6️⃣. Jika sudah galbay apakah masih bisa?*\n*7️⃣. Berapa Ongkos Jasanya?*\n*8️⃣. Alamat Kantor dimasing-masing kota*\n*9️⃣. Isi Formulir Pendaftaran*"
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage2);
                    }, 1000);


                }
                else if (message.message.conversation === '8') {

                    setTimeout(() => {

                    })
                    // Kirim gambar yang telah disiapkan
                    const responseMessage1 = {
                        text: 'Alamat Kantor Pusat: Jl. Mampang Prpt. Raya No.2c 6, RT.6/RW.6, Mampang Prpt., Kec. Mampang Prpt., Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12790\n(https://maps.app.goo.gl/WMZCaA9A9VodYh8DA)\n\n*Alamat Kantor Cabang Meruya* : Jl. Meruya Ilir Raya No.8B, RT.7/RW.6, Meruya Utara, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11620\n(https://maps.app.goo.gl/cF3DNjDdMsu6D9AS8)\n\n*Alamat Kantor Cabang Bekasi* : Komplek Ruko, Jl. Pesona Anggrek Harapan No.15A Blok A05, Harapan Jaya, Kec. Bekasi Utara, Kota Bks, Jawa Barat 17124\n(https://maps.app.goo.gl/61rg6aMbjbPHq1ja8)\n\n*Alamat Kantor Cabang Sukabumi* : Ruko Permata, Jl. Lkr. Sel., RT.018/RW.004, Cibatu, Kec. Cisaat, Kabupaten Sukabumi, Jawa Barat 43152\n(https://maps.app.goo.gl/JRUdW5qTzwvwbZbB7)\n\n*Alamat Kantor Cabang Probolinggo* : Jl. Probolinggo - Wonorejo, Kebonsari Wetan, Kec. Kanigaran, Kota Probolinggo, Jawa Timur 67214\n(https://maps.app.goo.gl/f39jS7mxA9PEGP666)\n\n*Alamat Kantor Cabang Serang* : Jl. Jayadiningrat Jl. Kaujon Kidul No.1, Serang, Kec. Serang, Kota Serang, Banten 42116\n(https://maps.app.goo.gl/mYX4YYy9cTRM18pr9)'
                    };
                    sock.sendMessage(message.key.remoteJid, responseMessage1, { quoted: message });

                    setTimeout(() => {
                        // Kirim pesan kedua
                        const responseMessage2 = {
                            text: "Silakan pilih angka di bawah ini:\n*1️⃣. Visi dan Misi Malahayati Consultant*\n*2️⃣. Legalitas Perusahaan*\n*3️⃣. 4 Keuntungan yang diraup oleh PINJOL*\n*4️⃣. Sistem Pengerjaan di Kantor*\n*5️⃣. Sistem pengerjaan di luar kota*\n*6️⃣. Jika sudah galbay apakah masih bisa?*\n*7️⃣. Berapa Ongkos Jasanya?*\n*8️⃣. Alamat Kantor dimasing-masing kota*\n*9️⃣. Isi Formulir Pendaftaran*"
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage2);
                    }, 3000);
                }
                else if (message.message.conversation === '3') {
                    // Kirim gambar yang telah disiapkan
                    const responseMessage1 = {
                        text: '*1. Keuntungan dari Segi Kuota*:\n Semua kuota yang digunakan oleh masyarakat untuk mengakses aplikasi pinjol akan dikumpulkan di server masing-masing pinjol. Setelah terkumpul jutaan terabyte dalam sebulan, maka kuota tersebut akan dijual kembali kepada masing-masing penyedia.\n\n*2. Keuntungan dari Segi Bunga*:\nSuku bunga dari pinjaman online sangat tinggi, bahkan melebihi suku bunga di perbankan.\n\n*3. Keuntungan dari Segi Denda*:\nNominal denda dari keterlambatan pembayaran dinilai tidak manusiawi, bahkan ada aplikasi pinjol yang menerapkan denda harian.\n\n*4. Keuntungan dari Segi Klaim Asuransi*:\nSetelah 90 hari keterlambatan pembayaran, aplikasi pinjaman online dapat mengajukan klaim asuransi kredit macet sehingga dana tersebut kembali ke perusahaan aplikasi pinjol.'
                    };
                    sock.sendMessage(message.key.remoteJid, responseMessage1, { quoted: message });
                    setTimeout(() => {
                        // Kirim pesan kedua
                        const responseMessage2 = {
                            text: "Silakan pilih angka di bawah ini:\n*1️⃣. Visi dan Misi Malahayati Consultant*\n*2️⃣. Legalitas Perusahaan*\n*3️⃣. 4 Keuntungan yang diraup oleh PINJOL*\n*4️⃣. Sistem Pengerjaan di Kantor*\n*5️⃣. Sistem pengerjaan di luar kota*\n*6️⃣. Jika sudah galbay apakah masih bisa?*\n*7️⃣. Berapa Ongkos Jasanya?*\n*8️⃣. Alamat Kantor dimasing-masing kota*\n*9️⃣. Isi Formulir Pendaftaran**"
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage2);
                    }, 1000);
                }
                else if (message.message.conversation === '4') {
                    // Kirim gambar yang telah disiapkan
                    const responseMessage1 = {
                        text: 'Malahayati Consultant akan membantu kalian yang ingin berhenti melakukan pembayaran pinjaman online atau galbay secara aman. Aman dari risiko-risiko yang harus ditanggung, antara lain:\n\n*1. Menyebar data di kontak pribadi*.\n*2. Didatangi oleh kolektor berkali-kali dan berganti kolektor*.\n*3. Risiko akibat BI Checking/Slik OJK.*\n\nDengan kehadiran Malahayati Consultant, ketiga risiko tersebut dapat ditangani dengan aman. Jika tertarik, Anda dapat langsung mengisi *Formulir Pendaftaran*.'
                    };
                    sock.sendMessage(message.key.remoteJid, responseMessage1, { quoted: message });

                    setTimeout(() => {
                        // Kirim pesan kedua
                        const responseMessage2 = {
                            text: "Silakan pilih angka di bawah ini:\n*1️⃣. Visi dan Misi Malahayati Consultant*\n*2️⃣. Legalitas Perusahaan*\n*3️⃣. 4 Keuntungan yang diraup oleh PINJOL*\n*4️⃣. Sistem Pengerjaan di Kantor*\n*5️⃣. Sistem pengerjaan di luar kota*\n*6️⃣. Jika sudah galbay apakah masih bisa?*\n*7️⃣. Berapa Ongkos Jasanya?*\n*8️⃣. Alamat Kantor dimasing-masing kota*\n*9️⃣. Isi Formulir Pendaftaran*"
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage2);
                    }, 1000);
                }
                else if (message.message.conversation === '5') {
                    // Kirim gambar yang telah disiapkan
                    const responseMessage1 = {
                        text: 'Malahayati Consultant akan membantu kalian yang ingin berhenti melakukan pembayaran pinjaman online atau galbay secara aman. Aman dari risiko-risiko yang harus ditanggung, antara lain:\n\n*1. Menyebar data di kontak pribadi*.\n*2. Didatangi oleh kolektor berkali-kali dan berganti kolektor*.\n*3. Risiko akibat BI Checking/Slik OJK*.\n\nDengan Malahayati Consultant, ketiga risiko tersebut dapat diatasi dengan aman. Jika tertarik, isi *Formulir Pendaftaran*. Tim kami akan validasi data lewat Video Call. Biaya tol dan bensin ditanggung oleh nasabah. Klien luar pulau: Tim beri foto KTP, klien beli tiket pesawat.'
                    };
                    sock.sendMessage(message.key.remoteJid, responseMessage1, { quoted: message });
                    setTimeout(() => {
                        // Kirim pesan kedua
                        const responseMessage2 = {
                            text: "Silakan pilih angka di bawah ini:\n*1️⃣. Visi dan Misi Malahayati Consultant*\n*2️⃣. Legalitas Perusahaan*\n*3️⃣. 4 Keuntungan yang diraup oleh PINJOL*\n*4️⃣. Sistem Pengerjaan di Kantor*\n*5️⃣. Sistem pengerjaan di luar kota*\n*6️⃣. Jika sudah galbay apakah masih bisa?*\n*7️⃣. Berapa Ongkos Jasanya?*\n*8️⃣. Alamat Kantor dimasing-masing kota*\n*9️⃣. Isi Formulir Pendaftaran*"
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage2);
                    }, 1000);
                }
                else if (message.message.conversation === '6') {
                    // Kirim gambar yang telah disiapkan
                    const responseMessage1 = {
                        text: 'Masih bisa, Tim kami akan berupaya mencarikan modal dari pinjol dengan cara yang aman. *Walaupun peluangnya lebih kecil dari Client yang belum jatuh tempo/galbay*. Agar Anda dapat membayar Jasa kami tanpa harus keluar uang pribadi. Dana yang masuk ke rekening dari pengerjaan Tim akan di bagi 2 yaitu 50% sebagai modal bagi Anda. Dan 50% lagi adalah fee untuk Tim. Semua Aplikasi yang di kerjakan oleh Tim, Biaya backupnya gratis. Anda hanya perlu membayar biaya backup aplikasi yang Anda cairkan sendiri dengan data asli, menggunakan dana 50% tadi.'
                    };
                    sock.sendMessage(message.key.remoteJid, responseMessage1, { quoted: message });

                    setTimeout(() => {
                        // Kirim pesan kedua
                        const responseMessage2 = {
                            text: "Silakan pilih angka di bawah ini:\n*1️⃣. Visi dan Misi Malahayati Consultant*\n*2️⃣. Legalitas Perusahaan*\n*3️⃣. 4 Keuntungan yang diraup oleh PINJOL*\n*4️⃣. Sistem Pengerjaan di Kantor*\n*5️⃣. Sistem pengerjaan di luar kota*\n*6️⃣. Jika sudah galbay apakah masih bisa?*\n*7️⃣. Berapa Ongkos Jasanya?*\n*8️⃣. Alamat Kantor dimasing-masing kota*\n*9️⃣. Isi Formulir Pendaftaran*"
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage2);
                    }, 1000);
                }
                else if (message.message.conversation === '7') {
                    // Kirim gambar yang telah disiapkan
                    const responseMessage1 = {
                        text: 'Setiap kantor jasa pasti ada biaya jasanya. Biaya jasanya adalah 10%-15% dari Total Piutang Per aplikasi. Tapi Tim kami akan berupaya mencarikan modal dari pinjol dengan cara yang aman. Agar Anda dapat membayar Jasa kami tanpa harus keluar uang pribadi. Dana yang masuk ke rekening dari pengerjaan Tim akan di bagi 2 yaitu 50% sebagai modal bagi Anda. Dan 50% lagi adalah fee untuk Tim. Semua Aplikasi yang di kerjakan oleh Tim, sudah include pembackupan. Anda hanya perlu membayar biaya backup aplikasi yang Anda cairkan sendiri dengan data asli, menggunakan dana 50% tadi.'
                    };
                    sock.sendMessage(message.key.remoteJid, responseMessage1, { quoted: message });

                    setTimeout(() => {
                        // Kirim pesan kedua
                        const responseMessage2 = {
                            text: "Silakan pilih angka di bawah ini:\n*1️⃣. Visi dan Misi Malahayati Consultant*\n*2️⃣. Legalitas Perusahaan*\n*3️⃣. 4 Keuntungan yang diraup oleh PINJOL*\n*4️⃣. Sistem Pengerjaan di Kantor*\n*5️⃣. Sistem pengerjaan di luar kota*\n*6️⃣. Jika sudah galbay apakah masih bisa?*\n*7️⃣. Berapa Ongkos Jasanya?*\n*8️⃣. Alamat Kantor dimasing-masing kota*\n*9️⃣. Isi Formulir Pendaftaran*"
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage2);
                    }, 1000);
                }
                else if (message.message.conversation === '9') {
                    // Kirim gambar yang telah disiapkan
                    const responseMessage1 = {
                        text: 'Silahkan klik link dibawah yang telah disiapkan\n\nhttps://bit.ly/Format-Pendaftaran_',


                    };
                    sock.sendMessage(message.key.remoteJid, responseMessage1);

                    // 
                }
                else if (message.message.conversation === '2') {
                    // Kirim gambar yang telah disiapkan
                    const responseMessage1 = {
                        image: {
                            url: "./image/legal.jpeg"
                        },
                        caption: 'Legalitas Perusahaan',
                        viewOnce: false
                    };

                    // Kirim pesan pertama
                    sock.sendMessage(message.key.remoteJid, responseMessage1, { quoted: message });

                    // Tunda pengiriman pesan kedua selama 1 detik
                    setTimeout(() => {
                        // Kirim pesan kedua
                        const responseMessage2 = {
                            text: "Silakan pilih angka di bawah ini:\n*1️⃣. Visi dan Misi Malahayati Consultant*\n*2️⃣. Legalitas Perusahaan*\n*3️⃣. 4 Keuntungan yang diraup oleh PINJOL*\n*4️⃣. Sistem Pengerjaan di Kantor*\n*5️⃣. Sistem pengerjaan di luar kota*\n*6️⃣. Jika sudah galbay apakah masih bisa?*\n*7️⃣. Berapa Ongkos Jasanya?*\n*8️⃣. Alamat Kantor dimasing-masing kota*\n*9️⃣. Isi Formulir Pendaftaran*"
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage2);
                    }, 3000); // Menunda pengiriman pesan kedua selama 1 detik (1000 milidetik)
                }

                else if (message.message.conversation.toLocaleLowerCase().includes('formulir pendaftaran')) {
                    // Kirim pesan balasan
                    const responseMessage = {
                        text: 'Baik, admin akan segera menelpon. Terima kasih🙏🏻🙂'
                    };

                    // Kirim pesan balasan
                    sock.sendMessage(message.key.remoteJid, responseMessage, { quoted: message });
                }

            }

            // Jika message.message memiliki media, maka print media
            if (message.message && message.message.imageMessage) {
                console.log('Message Media:', message.message.imageMessage.url);
            }

            // Dan seterusnya, tambahkan logika untuk properti-properti lainnya sesuai kebutuhan

            console.log('\n'); // Pemisah antara setiap pesan
        });
    });

    sock.ev.on('creds.update', saveCreds);
    setInterval(async () => {
        if (sock.state === 'close') {
            console.log('Connection closed. Attempting to reconnect...');
            connectionLogic();
        }
    }, 60000); // Check every minute
}

connectionLogic();


