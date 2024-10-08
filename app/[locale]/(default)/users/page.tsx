import {getHypaStoreLocations} from "~/client/queries/users";
export default async function Users() {
    const users = await getHypaStoreLocations();
    return (
        <div>
            <h1>Users List</h1>
            <ul class="ring-gray-800">
                {users.map((user) => (
                    <li key={user.id} class="bg-slate-600">
                        <img src={user.avatar} className="rounded-full mx-auto" />
                        <strong>{user.first_name} {user.last_name}</strong> - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}
