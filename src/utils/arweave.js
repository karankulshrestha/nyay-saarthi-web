import { Auth, Akord } from "@akord/akord-js";

export async function createVault(name) {
    const { wallet, jwt } = await Auth.signIn("officialkarankulx@gmail.com", "RAjboss001@apple");
    const akord = await Akord.init(wallet);
    const { vaultId, membershipId } = await akord.vault.create(name);
    return vaultId;
};


export async function addFile(vaultId, filePath, fileName) {
    const { wallet, jwt } = await Auth.signIn("officialkarankulx@gmail.com", "RAjboss001@apple");
    const akord = await Akord.init(wallet);
    const { stackId } = await akord.stack.create(vaultId, filePath, fileName);
    return stackId;
};


export async function getFiles(stackId) {
    const { wallet, jwt } = await Auth.signIn("officialkarankulx@gmail.com", "RAjboss001@apple");
    const akord = await Akord.init(wallet);
    const stack = await akord.stack.get(stackId);
    return stack;
};


export async function getAllStacks(req, res) {
    const data = req.body;
    if(data == null) return res.status(404).send("bad request");
    const { wallet, jwt } = await Auth.signIn("officialkarankulx@gmail.com", "RAjboss001@apple");
    const akord = await Akord.init(wallet);
    const stacks = await akord.stack.listAll(data.vaultId);
    res.status(201).send({"Stack objects": stacks});
};


export async function getUpdatedStack(req, res) {
    const data = req.body;
    if(data == null) return res.status(404).send("bad request");
    const { wallet, jwt } = await Auth.signIn("officialkarankulx@gmail.com", "RAjboss001@apple");
    const akord = await Akord.init(wallet);
    const arweaveUri = await akord.stack.getUri(stackId);
    res.status(201).send({"ArweaveUri": arweaveUri});
};


export async function getSingleFile(req, res) {
    const data = req.body;
    if(data == null) return res.status(404).send("bad request");
    const { wallet, jwt } = await Auth.signIn("karankulx@gmail.com", "RAjboss001@apple");
    const akord = await Akord.init(wallet);
    const arweaveUri = await akord.stack.get('658c4730-3f03-48b0-9298-5fa7d8a9db3e');
    res.status(201).send({"ArweaveUri": arweaveUri});
};


export async function downloadFile(req, res) {
    const data = req.body;
    if(data == null) return res.status(404).send("bad request");
    const { wallet, jwt } = await Auth.signIn("karankulx@gmail.com", "RAjboss001@apple");
    const akord = await Akord.init(wallet);
    const arweaveUri = await akord.stack.get('658c4730-3f03-48b0-9298-5fa7d8a9db3e');
    res.status(201).send({"ArweaveUri": arweaveUri});
};



// module.exports = {
//     createVault,
//     addFile,
//     getFile,
//     getAllStacks,
//     getUpdatedStack
// } 
