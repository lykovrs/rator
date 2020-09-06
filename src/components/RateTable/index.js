import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useRateTabelStyles } from "./style";
import fx from "money";

/**
 * Компонет таблицы значений круса валют
 * @param items элементы для построения таблицы
 * @returns {JSX.Element}
 * @constructor
 */
export default function SimpleTable({ items }) {
  const classes = useRateTabelStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">USD</TableCell>
            <TableCell align="right">EUR</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => {
            fx.rates = row.rates;

            return (
              <TableRow key={row.date}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="right">
                  {fx.convert(1, { from: "USD", to: "RUB" }).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {fx.convert(1, { from: "EUR", to: "RUB" }).toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
