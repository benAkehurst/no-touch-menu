import React from 'react';
import classes from './Message.module.scss';
import Aux from '../../../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';

const message = (props) => (
  <Aux>
    {props.messageType === 'contact_form' ? (
      <div className={classes.MessageWrapper}>
        <div>Message Type: {props.messageType}</div>
        <div>Message Email: {props.email}</div>
        <div>Message Name: {props.name}</div>
        <div>Message Content: {props.message}</div>
        <div>
          Has been read?:{' '}
          {props.hasRead ? (
            'Yes'
          ) : (
            <Button onClick={() => props.clicked(props.id)}>
              Mark as read
            </Button>
          )}
        </div>
      </div>
    ) : (
      <div className={classes.MessageWrapper}>
        <div>Message Type: {props.messageType}</div>
        <div>Email: {props.email}</div>
        <div>Token: {props.token}</div>
        <div>
          Has been read?:{' '}
          {props.hasRead ? (
            'Yes'
          ) : (
            <Button onClick={() => props.clicked(props.id)}>
              Mark as read
            </Button>
          )}
        </div>
      </div>
    )}
  </Aux>
);

export default message;
