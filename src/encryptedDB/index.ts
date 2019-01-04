import Realm from 'realm';
import schema from './schema';

declare var CryptoJS: any;

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

export async function tryPassword(password: string) {
    try {
        const realm = await openDatabase(password);
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
