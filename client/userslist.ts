
export const users = async () => {
    const res = await fetch('https://reqres.in/api/users?page=1');
    const data = await res.getBody();

    return {
        props: {
            users: data.data,
        },
    };
}
