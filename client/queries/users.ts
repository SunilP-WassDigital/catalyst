
export const getHypaStoreLocations = async (
): Promise<any> => {
    const path = `https://reqres.in/api/users`;
    try {
        const response = await fetch('https://reqres.in/api/users');
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const data = await response.json();
        return data.data;
    } catch (error) {
        return {
            locations: [],
            allTags: [],
            active: false,
        };
    }
};
