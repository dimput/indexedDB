/*
* IndexedDB
* */
createDatabase();
function createDatabase() {
    if (!('indexedDB' in window)){
        console.log('Web Browser tidak mendukung Indexed DB');
        return;
    }
    var request = window.indexedDB.open('latihan-pwa',1);
    request.onerror = errordbHandle;
    request.onupgradeneeded = (e)=>{
        var db = e.target.result;
        db.onerror = errordbHandle;
        var objectStore = db.createObjectStore('mahasiswa',
            {keyPath: 'nim'});
        console.log('Object store mahasiswa berhasil dibuat');
    }
    request.onsuccess = (e) => {
        db = e.target.result;
        db.error = errordbHandle;
        console.log('Berhasil melakukan koneksi ke database lokal');
        // lakukan sesuatu ...
        bacaDariDB();

    }
}


function errordbHandle(e) {
    console.log('Error DB : '+e.target.errorCode);
}

var nim = document.getElementById('nim'),
    nama = document.getElementById('nama'),
    gender = document.getElementById('gender'),
    form = document.getElementById('form-tambah'),
    tabel = document.getElementById('tabel-mahasiswa');

form.addEventListener('submit', tambahBaris);
tabel.addEventListener('click',hapusBaris);

function tambahBaris(e){
    if(tabel.rows.namedItem(nim.value)){
        alert('Error : NIM sudah terdaftar');
        e.preventDefault();
        return;
    }

    // masukkan datake Database
    tambahkeDB({
        nim : nim.value,
        nama : nama.value,
        gender : gender.value,
    });

    //append baris baru dari data form

    var baris = tabel.insertRow();
    baris.id = nim.value;
    baris.insertCell().appendChild(document.createTextNode(nim.value));
    baris.insertCell().appendChild(document.createTextNode(nama.value));
    baris.insertCell().appendChild(document.createTextNode(gender.value));

    // tambah bagian button delete

    var btn = document.createElement('input');
    btn.type = 'button';
    btn.value = 'Hapus';
    btn.id = nim.value;
    btn.className = ' btn btn-sm btn-danger';
    baris.insertCell().appendChild(btn);
    e.preventDefault();

}



function tambahkeDB(mahasiswa){
    var objectStore = buatTransaksi().objectStore('mahasiswa');
    var request = objectStore.add(mahasiswa);
    request.onerror = errordbHandle;
    request.onsuccess = console.log('Mahasiswa['+mahasiswa.nim+']'
    +'berhasil di tambahkan');

}
function buatTransaksi(){
    var transaction = db.transaction(['mahasiswa'],'readwrite');
    transaction.onerror = errordbHandle;
    transaction.complite = console.log('Transaksi selesai');

    return transaction;
}

function bacaDariDB(){
    var objectStore =  buatTransaksi().objectStore('mahasiswa');
    objectStore.openCursor().onsuccess = (e) => {
        var result = e.target.result;
        if(result){
            console.log('Membaca ['+result.value.nim+'] dari DB');
            var baris = tabel.insertRow();
            baris.id = nim.value;
            baris.insertCell().appendChild(document.createTextNode(nim.value));
            baris.insertCell().appendChild(document.createTextNode(nama.value));
            baris.insertCell().appendChild(document.createTextNode(gender.value));

        //// tambah tombol hapus
            var btn = document.createElement('input');
            btn.type = 'button';
            btn.value = 'Hapus';
            btn.id = result.nim.value;
            btn.className= ' btn btn-sm btn-danger';
            baris.insertCell().appendChild(btn);
            result.continue();

            }

        }
    }

    function hapusBaris(e){
        if (e.target.type === 'button'){
            var hapus = confirm('apakah yakin menghapus data?');
            if(hapus){
                console.log(e.target);
                tabel.deleteRow(tabel.rows.namedItem(e.target.id).sectionRowIndex);
                hapusDariDB(e.target.id);
            }
        }
    }
    function hapusDariDB(nim){
        var objectStore = buatTransaksi().objectStore('mahasiswa');
        var request = objectStore.delete(nim);
        request.onerror= errordbHandle;
        request.onsuccess = console.log('Mahasiswa ['+nim+'] terhapus');
    }