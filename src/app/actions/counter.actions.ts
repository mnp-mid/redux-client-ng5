import { ICounter } from "../models/counter";

// see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/

/**
 * Keys for actions
 */

export enum TypeKeys {
  DECREMENTED = "DECREMENTED",
  INCREMENTED = "INCREMENTED",
  LOADED = "LOADED",
  LOADING = "LOADING",
  SAVING = "SAVING",
  OTHER_ACTION = "__any_other_action_type__",
}

/***********
 * Actions *
 ***********/

/**
 * Interface for the decrement action.
 */
export interface IDecrementedCounterAction {
  type: TypeKeys.DECREMENTED;
  payload: {
    index: number;
    counter: ICounter;
  };
}

/**
 * Interface for the increment action.
 */
export interface IIncrementedCounterAction {
  type: TypeKeys.INCREMENTED;
  payload: {
    index: number;
    counter: ICounter;
  };
}

/**
 * Interface for the loaded action.
 */
export interface ILoadedAction {
  type: TypeKeys.LOADED;
  payload: {
    index: number;
    counter: ICounter;
  };
}

/**
 * Interface for the loading action.
 */
export interface ILoadingAction {
  type: TypeKeys.LOADING;
  payload: {
    index: number;
  };
}

/**
 * Interface for the saving action.
 */
export interface ISavingAction {
  type: TypeKeys.SAVING;
  payload: {
    index: number;
  };
}

/**
 * Interface for all actions living outside
 * this app. TypeScript will warn us if we
 * forget to handle this special action type.
 */
export interface IOtherAction {
  type: TypeKeys.OTHER_ACTION;
}

export type ActionTypes =
  | IDecrementedCounterAction
  | IIncrementedCounterAction
  | ILoadedAction
  | ILoadingAction
  | ISavingAction
  | IOtherAction;
