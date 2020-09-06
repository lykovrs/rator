import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
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
import Chart from "../../components/Chart";
import RateTable from "../../components/RateTable";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useRateStyles } from "./styles.js";

import {
  selectRatePolling,
  togglePolling,
  selectCurrentDate,
  selectRateHistory,
  fetchRateByDate,
} from "./rateSlice";

export default function Rate() {
  const dispatch = useDispatch();
  const classes = useRateStyles();
  const isActivePolling = useSelector(selectRatePolling);
  const currentDate = useSelector(selectCurrentDate);
  const rates = useSelector(selectRateHistory);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  useEffect(() => {
    if (isActivePolling && dayjs(currentDate).isSameOrBefore(dayjs())) {
      const interval = setInterval(() => {
        dispatch(fetchRateByDate(currentDate));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [dispatch, isActivePolling, currentDate]);

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
            Rate
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
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart items={rates} />
              </Paper>
            </Grid>

            {/* Start/stop polling */}
            <Grid item xs={12} md={4} lg={3}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => {
                  dispatch(togglePolling());
                }}
              >
                {isActivePolling ? "Stop" : "Start"} polling
              </Button>
            </Grid>

            {/* Recent rates */}
            <Grid item xs={12}>
              <RateTable items={rates} />
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
