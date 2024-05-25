// Import modul yang diperlukan
const { DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { text } = require('express');
const makeWASocket = require('@whiskeysockets/baileys').default;
const fs = require('fs-extra'); // fs-extra untuk operasi file
const path = require('path');

const authFolderPath = path.join(__dirname, 'auth_info_baileys');

async function connectionLogic() {
    const { state, saveCreds } = await useMultiFileAuthState(authFolderPath);
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update || {};

        if (qr) {
            console.log('Scan the QR code:', qr);
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);

            if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
                // Hapus folder auth_info_baileys dan regenerasi QR code
                console.log('Logged out, clearing auth folder and regenerating QR code');
                await fs.remove(authFolderPath);
                connectionLogic();
            } else if (shouldReconnect) {
                connectionLogic();
            }
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
        messageInfoUpsert.messages.forEach(async (message) => {
            // Print message details
            console.log('pesan4 =>');
            console.log('Key:', message.key);
            console.log('Timestamp:', message.messageTimestamp);
            console.log('Push Name:', message.pushName);
            console.log('Broadcast:', message.broadcast);
            // Jika message.message memiliki conversation, maka print conversation

            const validNumbers = ['1', '2', '3', '4', '5', '6'];

            const conversation = message.message?.conversation;


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
                            text: "Silakan pilih angka di bawah ini:\n*1️⃣. Legalitas Perusahaan dan Alamat Kantor*\n*2️⃣. Sistem Pengerjaan di Kantor*\n*3️⃣. Sistem pengerjaan di luar kota*\n*4️⃣. Jika sudah galbay apakah masih bisa?*\n*5️⃣. Berapa Ongkos Jasanya?*\n*6️⃣. Isi Formulir Pendaftaran*"
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage2);
                    }, 500);
                }
                if (validNumbers.includes(conversation)) {
                    if (message.message.conversation === '1') {
                        // Kirim gambar yang telah disiapkan
                        const responseMessage1 = {
                            image: {
                                url: "./image/legal.jpeg"
                            },
                            caption: '*Malahayati Consultant* adalah lembaga resmi yang memiliki legalitas perusahaan dan berbadan hukum di bawah naungan\n*PT. MALAHAYATI NUSANTARA RAYA*',
                            viewOnce: false
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage1,);
                        setTimeout(() => {

                            const responseMessage2 = {
                                text: 'Alamat Kantor Pusat: Jl. Mampang Prpt. Raya No.2 6, RT.6/RW.6, Mampang Prpt., Kec. Mampang Prpt., Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12790\n(https://maps.app.goo.gl/WMZCaA9A9VodYh8DA)\n\n*Alamat Kantor Cabang Meruya* : Jl. Meruya Ilir Raya No.8B, RT.7/RW.6, Meruya Utara, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11620\n(https://maps.app.goo.gl/cF3DNjDdMsu6D9AS8)\n\n*Alamat Kantor Cabang Bekasi* : Komplek Ruko, Jl. Pesona Anggrek Harapan No.15A Blok A05, Harapan Jaya, Kec. Bekasi Utara, Kota Bks, Jawa Barat 17124\n(https://maps.app.goo.gl/61rg6aMbjbPHq1ja8)\n\n*Alamat Kantor Cabang Sukabumi* : Ruko Permata, Jl. Lkr. Sel., RT.018/RW.004, Cibatu, Kec. Cisaat, Kabupaten Sukabumi, Jawa Barat 43152\n(https://maps.app.goo.gl/JRUdW5qTzwvwbZbB7)\n\n*Alamat Kantor Cabang Probolinggo* : Jl. Probolinggo - Wonorejo, Kebonsari Wetan, Kec. Kanigaran, Kota Probolinggo, Jawa Timur 67214\n(https://maps.app.goo.gl/f39jS7mxA9PEGP666)\n\n*Alamat Kantor Cabang Serang* : Jl. Jayadiningrat Jl. Kaujon Kidul No.1, Serang, Kec. Serang, Kota Serang, Banten 42116\n(https://maps.app.goo.gl/mYX4YYy9cTRM18pr9)'
                            };
                            sock.sendMessage(message.key.remoteJid, responseMessage2,);
                        }, 2000)
                        // setTimeout(() => {
                        //     // Kirim pesan kedua
                        //     const responseMessage3 = {
                        //         text: "Silakan pilih angka di bawah ini:\n*1️⃣. Legalitas Perusahaan dan Alamat Kantor*\n*2️⃣. Sistem Pengerjaan di Kantor*\n*3️⃣. Sistem pengerjaan di luar kota*\n*4️⃣. Jika sudah galbay apakah masih bisa?*\n*5️⃣. Berapa Ongkos Jasanya?*\n*6️⃣. Isi Formulir Pendaftaran*"
                        //     };
                        //     sock.sendMessage(message.key.remoteJid, responseMessage3);
                        // }, 2000);
                    }
                    else if (message.message.conversation === '2') {

                        setTimeout(() => {
                        })
                        // Kirim gambar yang telah disiapkan
                        const responseMessage1 = {
                            text: 'Satu satunya cara untuk lepas dari jeratan pinjol adalah *stop melakukan pembayaran PINJOL*.\nSegala resiko dari Stop Pembayaran Pinjol akan kami cover sepenuhnya, antara lain:\n\n*1. Menyebar data di kontak pribadi.*\n*2. Didatangi oleh kolektor berkali-kali dan berganti kolektor.*\n*3. Risiko akibat BI Checking/Slik OJK.*\n\nDengan kehadiran Malahayati Consultant, ketiga risiko tersebut dapat ditangani dengan aman.'
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage1,);

                        setTimeout(() => {
                            // Kirim pesan kedua
                            const responseMessage2 = {
                                text: "Silakan pilih angka di bawah ini:\n*1️⃣. Legalitas Perusahaan dan Alamat Kantor*\n*2️⃣. Sistem Pengerjaan di Kantor*\n*3️⃣. Sistem pengerjaan di luar kota*\n*4️⃣. Jika sudah galbay apakah masih bisa?*\n*5️⃣. Berapa Ongkos Jasanya?*\n*6️⃣. Isi Formulir Pendaftaran*"
                            };
                            sock.sendMessage(message.key.remoteJid, responseMessage2);
                        }, 1000);
                    }

                    else if (message.message.conversation === '3') {
                        // Kirim gambar yang telah disiapkan
                        const responseMessage1 = {
                            text: 'Malahayati Consultant akan membantu kalian yang ingin berhenti melakukan pembayaran pinjaman online atau galbay secara aman. Aman dari risiko-risiko yang harus ditanggung, antara lain:\n\n*1. Menyebar data di kontak pribadi*.\n*2. Didatangi oleh kolektor berkali-kali dan berganti kolektor*.\n*3. Risiko akibat BI Checking/Slik OJK*.\n\nDengan Malahayati Consultant, ketiga risiko tersebut dapat diatasi dengan aman. Jika tertarik, isi *Formulir Pendaftaran*. Tim kami akan validasi data lewat Video Call. Biaya tol dan bensin ditanggung oleh nasabah. Klien luar pulau: Tim beri foto KTP, klien beli tiket pesawat.'
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage1,);
                        setTimeout(() => {
                            // Kirim pesan kedua
                            const responseMessage2 = {
                                text: "Silakan pilih angka di bawah ini:\n*1️⃣. Legalitas Perusahaan dan Alamat Kantor*\n*2️⃣. Sistem Pengerjaan di Kantor*\n*3️⃣. Sistem pengerjaan di luar kota*\n*4️⃣. Jika sudah galbay apakah masih bisa?*\n*5️⃣. Berapa Ongkos Jasanya?*\n*6️⃣. Isi Formulir Pendaftaran*"
                            };
                            sock.sendMessage(message.key.remoteJid, responseMessage2);
                        }, 1000);
                    }
                    else if (message.message.conversation === '4') {
                        // Kirim gambar yang telah disiapkan
                        const responseMessage4 = {
                            text: 'Masih bisa, Tim kami akan berupaya mencarikan modal dari pinjol dengan cara yang aman. *Walaupun peluangnya lebih kecil dari Client yang belum jatuh tempo/galbay*. Agar Anda dapat membayar Jasa kami tanpa harus keluar uang pribadi. Dana yang masuk ke rekening dari pengerjaan Tim akan di bagi 2 yaitu 50% sebagai modal bagi Anda. Dan 50% lagi adalah fee untuk Tim. Semua Aplikasi yang di kerjakan oleh Tim, Biaya backupnya gratis. Anda hanya perlu membayar biaya backup aplikasi yang Anda cairkan sendiri dengan data asli, menggunakan dana 50% tadi.'
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage4,);

                        setTimeout(() => {
                            // Kirim pesan kedua
                            const responseMessage2 = {
                                text: "Silakan pilih angka di bawah ini:\n*1️⃣. Legalitas Perusahaan dan Alamat Kantor*\n*2️⃣. Sistem Pengerjaan di Kantor*\n*3️⃣. Sistem pengerjaan di luar kota*\n*4️⃣. Jika sudah galbay apakah masih bisa?*\n*5️⃣. Berapa Ongkos Jasanya?*\n*6️⃣. Isi Formulir Pendaftaran*"
                            };
                            sock.sendMessage(message.key.remoteJid, responseMessage2);
                        }, 1000);
                    }
                    else if (message.message.conversation === '5') {
                        // Kirim gambar yang telah disiapkan
                        const responseMessage1 = {
                            text: 'Setiap kantor jasa pasti ada biaya jasanya. Biaya jasanya adalah 10%-15% dari Total Piutang Per aplikasi. Tapi Tim kami akan berupaya mencarikan modal dari pinjol dengan cara yang aman. Agar Anda dapat membayar Jasa kami tanpa harus keluar uang pribadi. Dana yang masuk ke rekening dari pengerjaan Tim akan di bagi 2 yaitu 50% sebagai modal bagi Anda. Dan 50% lagi adalah fee untuk Tim. Semua Aplikasi yang di kerjakan oleh Tim, sudah include pembackupan. Anda hanya perlu membayar biaya backup aplikasi yang Anda cairkan sendiri dengan data asli, menggunakan dana 50% tadi.'
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage1,);

                        // setTimeout(() => {
                        //     // Kirim pesan kedua
                        //     // const responseMessage2 = {
                        //     //     text: "Silakan pilih angka di bawah ini:\n*1️⃣. Legalitas Perusahaan dan Alamat Kantor*\n*2️⃣. Sistem Pengerjaan di Kantor*\n*3️⃣. Sistem pengerjaan di luar kota*\n*4️⃣. Jika sudah galbay apakah masih bisa?*\n*5️⃣. Berapa Ongkos Jasanya?*\n*6️⃣. Isi Formulir Pendaftaran*"
                        //     // };
                        //     sock.sendMessage(message.key.remoteJid, { audio: { url: "uhuy.mp3", mimetype: 'audio/mp4' } }, { url: "uhuy.mp3" });
                        // }, 500);

                        setTimeout(() => {
                            // Kirim pesan kedua
                            const responseMessage2 = {
                                text: "Silakan pilih angka di bawah ini:\n*1️⃣. Legalitas Perusahaan dan Alamat Kantor*\n*2️⃣. Sistem Pengerjaan di Kantor*\n*3️⃣. Sistem pengerjaan di luar kota*\n*4️⃣. Jika sudah galbay apakah masih bisa?*\n*5️⃣. Berapa Ongkos Jasanya?*\n*6️⃣. Isi Formulir Pendaftaran*"
                            };
                            sock.sendMessage(message.key.remoteJid, responseMessage2);
                        }, 1000);
                    }
                    else if (message.message.conversation === '6') {
                        // Kirim gambar yang telah disiapkan
                        const responseMessage1 = {
                            text: 'Silahkan klik link dibawah yang telah disiapkan\n\nhttps://bit.ly/Format-Pendaftaran_',
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage1);
                        // Tandai pesan sebagai dibaca

                        // 
                    }
                }
                // Jika pesan adalah "1"
                else if (/^\d+$/.test(conversation) && !validNumbers.includes(conversation)) {
                    // Pesan adalah angka tetapi bukan 1-6
                    const responseMessage1 = {
                        text: 'Mohon maaf pilihanmu tidak tersedia🙏',
                    };
                    sock.sendMessage(message.key.remoteJid, responseMessage1);
                    setTimeout(() => {
                        // Kirim pesan kedua
                        const responseMessage2 = {
                            text: "Silakan pilih angka di bawah ini:\n*1️⃣. Legalitas Perusahaan dan Alamat Kantor*\n*2️⃣. Sistem Pengerjaan di Kantor*\n*3️⃣. Sistem pengerjaan di luar kota*\n*4️⃣. Jika sudah galbay apakah masih bisa?*\n*5️⃣. Berapa Ongkos Jasanya?*\n*6️⃣. Isi Formulir Pendaftaran*"
                        };
                        sock.sendMessage(message.key.remoteJid, responseMessage2);
                    }, 1000);
                }
                else if (message.message.conversation.toLocaleLowerCase().includes('formulir pendaftaran')) {
                    // Kirim pesan balasan
                    const responseMessage = {
                        text: 'Baik, admin akan segera menelpon. Terima kasih🙏🏻🙂'
                    };
                    const reactionMessage = {
                        react: {
                            text: "📝", // use an empty string to remove the reaction
                            key: message.key,
                        },
                    };
                    sock.sendMessage(message.key.remoteJid, reactionMessage);

                    // Kirim pesan balasan
                    sock.sendMessage(message.key.remoteJid, responseMessage,);
                }

                const key = {
                    remoteJid: message.key.remoteJid,
                    id: message.key.id, // id dari pesan yang ingin ditandai sebagai dibaca
                    participant: message.key.participant, // ID pengguna yang mengirim pesan (undefined untuk chat individu)
                };

                sock.readMessages([key]);
            } else {

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
}

connectionLogic();