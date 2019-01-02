import Realm from 'realm';

declare var CryptoJS: any;

const schema = [{
    name: 'Dog',
    properties: {
        name: 'string'
    }
}]

export async function encryptedDbExsits() {
    const unencryptedConfig = {
        schema
    };

    try {
        const realm = await Realm.open(unencryptedConfig);
        realm.close();
        await Realm.deleteFile(unencryptedConfig);

        return false; // We could open (i.e. create) the database without a password - it doesn't exist
        // (and if there was any database.... not anymore, we just deleted the file :'D)
    } catch (ex) {
        console.warn(ex.message);
        return true; // Probably?
    }
}

let workingEncryptionKey: Int32Array | null = null;
export async function tryPassword(password: string) {
    const passwordHash = CryptoJS.EvpKDF(password, '', { keySize: 16 });
    const encryptionKey = new Int32Array(passwordHash.words);
    
    try {
        const realm = await Realm.open({
            schema,
            encryptionKey
        });

        workingEncryptionKey = encryptionKey;
        realm.close();

        return true;
    }catch (ex) {
        console.warn(ex.message);
        return false;
    }
}

export function openDatabase(password: string) {
    const passwordHash = CryptoJS.EvpKDF(password, '', { keySize: 16 });
    const encryptionKey = new Int32Array(passwordHash.words);
    
    return Realm.open({
        schema,
        encryptionKey
    });
}
