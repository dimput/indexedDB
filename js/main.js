/*
* Create Database IndexDB
*/

createDatabase();
function createDatabase(){
    if(!('indexedDB' in window)){
        console.log('ANDA CUPU !');
        return;
    }
    var request = window.indexedDB.open('latihan-idb',1);
    request.onerror = handleError;
    request.onupgradeneeded = (e) => {
        var db = e.target.result;
        db.onerror = handleError;
        console.log('wow');
        var objectStore = db.createObjectStore('mahasiswa',
            {keyPath: 'nim'});
        console.log('Objek Store mahassiwa berhasil dibuat');
    }
    request.onsuccess = (e) => {
        db = e.target.result;
        db.error = handleError;
        console.log("Berhasil Melakukan Koneksi ke db Lokal");
    }
}

function handleError(e){
    console.log('error DB : ' + e.target.errorCode);
}

var nim = document.getElementById('nim');
var nama = document.getElementById('nama');
var gender = document.getElementById('gender');
var form = document.getElementById('form-tambah');
var tabel = document.getElementById('tabel-mahasiswa');


form.addEventListener('submit',tambahBaris);

function tambahBaris(e){
    if(tabel.rows.namedItem(nim.value)){
        alert('Error : NIM sudah terdaftar');
        e.preventDefault();
        return;
    }

    tambahKeDatabase({
        nim : nim.value,
        nama : nama.value,
        gender : gender.value
    });

    var baris = tabel.insertRow();
        baris.insertCell().appendChild(document.createTextNode(nim.value));
        baris.insertCell().appendChild(document.createTextNode(nama.value));
        baris.insertCell().appendChild(document.createTextNode(gender.value));

    var tombolHapus = document.createElement('input');
    tombolHapus.type = 'button';
    tombolHapus.value = 'Delete';
    tombolHapus.id = nim.value;
    baris.insertCell().appendChild(tombolHapus);
    e.preventDefault();
}

function tambahKeDatabase(mahasiswa){
    var objectStore = buatTransaksi().objectStore('mahasiswa');
    var request = objectStore.add(mahasiswa);
    request.onerror = handleError;
    request.onsucces = console.log('mahasiswa [' + mahasiswa.nim + '] berhasil ditambahkan');
}

function buatTransaksi(){
    var transaction = db.transaction(['mahasiswa'],'readwrite');
    transaction.onerror = handleError;
    transaction.oncomplete = console.log('transaksi baru done');
}