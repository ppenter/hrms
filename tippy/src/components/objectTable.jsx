import React from 'react';

const ObjectTable = ({ data, _headers }) => {
  const headers = _headers || Object?.keys(data?.[0] || {});
  const tableData = data?.map((item, index) => (
    <tr key={index}>
      {headers?.map((header, headerIndex) => (
        <td key={headerIndex} className="border px-4 py-2">
          {!header.includes('image') ? (
            <>
            {item?.[header]}
            </>
          ) : (
            item?.[header] && <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/attendance_images/${item?.[header]}`} />
          )}
        </td>
      ))}
    </tr>
  ));

  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          {headers?.map((header, index) => (
            <th key={index} className="border px-4 py-2">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{tableData}</tbody>
    </table>
  );
};

export default ObjectTable;