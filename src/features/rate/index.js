import React, { useEffect } from "react";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Chart from "../../components/RateChart";
import Table from "../../components/RateTable";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useRateStyles } from "./styles.js";

import {
  selectRatePolling,
  startPolling,
  stopPolling,
  selectCurrentDate,
  selectRateHistory,
  fetchRateByDate,
} from "./rateSlice";

import { defaultPollingTime } from "../../constants";
import LinearProgress from "@material-ui/core/LinearProgress";

/**
 * Компонент страницы с информацией о курсах валют
 * @returns {JSX.Element}
 * @constructor
 */
export default function Rate() {
  const dispatch = useDispatch();
  const classes = useRateStyles();
  const isActivePolling = useSelector(selectRatePolling);
  const currentDate = useSelector(selectCurrentDate);
  const rates = useSelector(selectRateHistory);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  // Отправляем запрос через равные промежутки времени, по флагу и следим, чтобы дата не была больше текущей
  useEffect(() => {
    if (isActivePolling) {
      const interval = setInterval(() => {
        dispatch(fetchRateByDate(currentDate));
      }, defaultPollingTime);
      return () => clearInterval(interval);
    }
  }, [dispatch, isActivePolling, currentDate]);
  // Если дата текущая дата старше текущей, останаливаем поллинг
  if (dayjs(currentDate).isAfter(dayjs())) {
    dispatch(stopPolling());
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar className={classes.toolbar}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            exchangeratesapi.io
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={rates.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {isActivePolling && <LinearProgress />}
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart items={rates} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <Button
                disabled={dayjs(currentDate).isAfter(dayjs())}
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => {
                  dispatch(startPolling());
                }}
              >
                {isActivePolling ? "Stop" : "Start"} polling
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Table items={rates} />
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
