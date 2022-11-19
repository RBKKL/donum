export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result?.toString());
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};
export const base64ToBlob = async (base64string) => {
    const base64Response = await fetch(base64string);
    return await base64Response.blob();
};
