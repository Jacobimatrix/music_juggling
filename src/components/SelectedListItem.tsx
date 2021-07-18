import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  })
);

type Props = {
  theList: string[];
  onSelect: (selectedIndex: number) => void;
};

export default function SelectedListItem(props: Props) {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    props.onSelect(index);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="project folders">
        {props.theList.map((value, index) => {
          return (
            <ListItem
              button
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(event, index)}
              key={value}
            >
              <ListItemText primary={value} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
