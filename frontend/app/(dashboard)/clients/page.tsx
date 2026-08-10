"use client";
const clients = [
  "Amelia Carter",
  "Noah Williams",
  "Olivia Brown",
  "Liam Davis",
  "Emma Wilson",
  "James Taylor",
];
export default function ClientsPage() {
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Clients</h1>
          <p>Keep track of your client relationships and care history.</p>
        </div>
      </div>
      <section className="content-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Last visit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((name, index) => (
                <tr key={name}>
                  <td>
                    <span className="client-name">
                      <span className="avatar small">{name[0]}</span>
                      {name}
                    </span>
                  </td>
                  <td>{name.toLowerCase().replace(" ", ".")}@email.com</td>
                  <td>Aug {index + 2}, 2026</td>
                  <td>
                    <span
                      className={`status ${index === 4 ? "inactive" : "confirmed"}`}
                    >
                      {index === 4 ? "Inactive" : "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
