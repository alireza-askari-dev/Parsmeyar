
export default () => {
    return typeof window !== "undefined"
        ? localStorage.getItem("UserID") || 0
        : 0;
}
