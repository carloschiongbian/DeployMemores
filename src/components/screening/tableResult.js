const TableResult = ({ classification, classProbability, fullname, tablePadding = 'my-4' }) => {

    const calc = (number) => {
        let with2Decimals = number.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
        return with2Decimals;
    };

    const _class = classification === "0" ? "Negative" : "Positive";
    const _probability = calc(classProbability);
    const positiveIndicative = <span className="text-danger fw-bold">DOES</span>;
    const negativeIndicative = (
        <span className="text-success fw-bold">DOES NOT</span>
    );

    return (
        <>
            <div className={`d-flex justify-content-center ${tablePadding}`}>
                <table className="table w-50 fs-4">
                    <thead className="text-center">
                        <tr className="fs-6">
                            <th>Classification</th>
                            <th>Probability</th>
                        </tr>
                    </thead>
                    <tbody className="text-center fw-bold">
                        <tr
                            className={_class === "Negative" ? "text-success" : "text-danger"}
                        >
                            <td>{_class}</td>
                            <td>{_probability}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p className="text-center">
                Based on the screening test, the result for{" "}
                <span className="text-primary fw-bold">{fullname}</span>{" "}
                {_class === "Negative" ? negativeIndicative : positiveIndicative} suggest a{" "}
                <span
                    className={`fw-bold ${_class === "Negative" ? "text-success" : "text-danger"
                        }`}
                >
                    manifestation of social anxiety disorder
                </span>{" "}
                with a prediction probability of{" "}
                <span
                    className={`fw-bold ${_class === "Negative" ? "text-success" : "text-danger"
                        }`}
                >
                    {_probability}%
                </span>
                .
            </p>
        </>
    );
}

export default TableResult;