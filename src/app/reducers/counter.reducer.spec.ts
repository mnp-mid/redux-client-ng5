import {
  CounterActionTypeKeys,
  IDecrementCompletedCounterAction,
  IIncrementCompletedCounterAction,
  ILoadAllCompletedAction,
  ILoadAllPendingAction,
  ILoadCompletedAction,
  ILoadPendingAction,
  IOtherAction,
  ISavePendingAction,
} from "../actions/counter.actions";
import { INITIAL_COUNTERS_STATE } from "../models/app-state";
import { Counter, ICounter } from "../models/counter";
import { counterReducer } from "./counter.reducer";
import { ErrorActionTypeKeys, IResetErrorsAction } from "../actions/error.actions";

describe("Counter Reducer function", () => {
  let state: ICounter[]; // tslint:disable-line:prefer-const
  let index;
  let value;
  let counter: ICounter;
  let anotherCounter: ICounter;
  let yetAnotherCounter: ICounter;
  let decrementedCounterAction: IDecrementCompletedCounterAction;
  let incrementedCounterAction: IIncrementCompletedCounterAction;
  let loadedAction: ILoadCompletedAction;
  let loadedAllAction: ILoadAllCompletedAction;
  let loadPendingAction: ILoadPendingAction;
  let loadingAllAction: ILoadAllPendingAction;
  let savePendingAction: ISavePendingAction;

  /*
   * Helper function to get a specific counter out of an app state object
   */
  const getItemForIndex = (theState: ICounter[], theIndex: number): ICounter => {
    return theState.find((theCounter: ICounter) => theCounter.index === theIndex);
  };

  beforeEach(() => {
    state = INITIAL_COUNTERS_STATE;
    index = 1;
    value = 42;

    anotherCounter = new Counter(index - 1, value - 1);
    counter = new Counter(index, value);
    yetAnotherCounter = new Counter(index + 1, value + 1);

    decrementedCounterAction = {
      type: CounterActionTypeKeys.DECREMENT_COMPLETED,
      payload: {
        index,
        counter: new Counter(index, value - 1),
      },
    };
    incrementedCounterAction = {
      type: CounterActionTypeKeys.INCREMENT_COMPLETED,
      payload: {
        index,
        counter: new Counter(index, value + 1),
      },
    };
    loadedAction = {
      type: CounterActionTypeKeys.LOAD_COMPLETED,
      payload: {
        index,
        counter,
      },
    };
    loadedAllAction = {
      type: CounterActionTypeKeys.LOAD_ALL_COMPLETED,
      payload: {
        counters: [anotherCounter, counter, yetAnotherCounter],
      },
    };
    loadPendingAction = {
      type: CounterActionTypeKeys.LOAD_PENDING,
      payload: {
        index,
      },
    };
    loadingAllAction = {
      type: CounterActionTypeKeys.LOAD_ALL_PENDING,
    };
    savePendingAction = {
      type: CounterActionTypeKeys.SAVE_PENDING,
      payload: {
        index,
      },
    };
  });

  it("should use its initial value with an undefined state", () => {
    const otherAction: IOtherAction = {
      type: CounterActionTypeKeys.OTHER_ACTION,
    };

    state = counterReducer(undefined, otherAction);

    expect(state.length).toBe(0);
  });

  describe("with the decremented action", () => {
    it("should not decrement a counter not in the app state", () => {
      const result = counterReducer(state, decrementedCounterAction);

      expect(result.length).toBe(0);
    });

    it("should decrement a single counter in the app state", () => {
      state = [counter];

      const result = counterReducer(state, decrementedCounterAction);
      expect(result).not.toBe(state);
      expect(result.length).toBe(state.length);
      const oldItem = getItemForIndex(state, index);
      const newItem = getItemForIndex(result, index);
      expect(newItem).not.toBe(oldItem);
      expect(newItem.value).toBe(oldItem.value - 1);
    });

    it("should decrement a counter in the middle of the app state", () => {
      state = [anotherCounter, counter, yetAnotherCounter];

      const result = counterReducer(state, decrementedCounterAction);
      expect(result).not.toBe(state);
      expect(result.length).toBe(state.length);
      const oldItem = getItemForIndex(state, index);
      const newItem = getItemForIndex(result, index);
      expect(newItem).not.toBe(oldItem);
      expect(newItem.value).toBe(oldItem.value - 1);
    });

    it("should handle a non-present counter", () => {
      state = [anotherCounter, yetAnotherCounter];

      const result = counterReducer(state, decrementedCounterAction);
      expect(result.length).toBe(state.length);

      const newCounter = getItemForIndex(result, index);
      expect(newCounter).toBeUndefined();
    });
  });

  describe("with the incremented action", () => {
    it("should not increment a counter not in the app state", () => {
      const result = counterReducer(state, incrementedCounterAction);

      expect(result.length).toBe(0);
    });

    it("should increment a single counter in the app state", () => {
      state = [counter];

      const result = counterReducer(state, incrementedCounterAction);
      expect(result).not.toBe(state);
      expect(result.length).toBe(state.length);
      const oldItem = getItemForIndex(state, index);
      const newItem = getItemForIndex(result, index);
      expect(newItem).not.toBe(oldItem);
      expect(newItem.value).toBe(oldItem.value + 1);
    });

    it("should increment a counter in the middle of the app state", () => {
      state = [anotherCounter, counter, yetAnotherCounter];

      const result = counterReducer(state, incrementedCounterAction);
      expect(result).not.toBe(state);
      expect(result.length).toBe(state.length);
      const oldItem = getItemForIndex(state, index);
      const newItem = getItemForIndex(result, index);
      expect(newItem).not.toBe(oldItem);
      expect(newItem.value).toBe(oldItem.value + 1);
    });

    it("should handle a non-present counter", () => {
      state = [anotherCounter, yetAnotherCounter];

      const result = counterReducer(state, incrementedCounterAction);
      expect(result.length).toBe(state.length);

      const newCounter = getItemForIndex(result, index);
      expect(newCounter).toBeUndefined();
    });
  });

  describe("with the loaded action", () => {
    it("should set the properties for the placeholder counter as single counter in the array", () => {
      const oldCounter = new Counter(index);
      oldCounter.isLoading = true;
      state = [oldCounter];

      const result = counterReducer(state, loadedAction);
      expect(result.length).toBe(1);
      const newCounter = getItemForIndex(result, index);
      expect(newCounter.index).toBe(oldCounter.index);
      expect(newCounter.value).toBe(value);
      expect(newCounter.isLoading).toBeFalsy();
    });

    it("should set the properties for the placeholder counter for some counters in the array", () => {
      const oldCounter = new Counter(index);
      oldCounter.isLoading = true;
      state = [anotherCounter, oldCounter, yetAnotherCounter];

      const result = counterReducer(state, loadedAction);
      expect(result.length).toBe(3);
      const newCounter = getItemForIndex(result, index);
      expect(newCounter.index).toBe(oldCounter.index);
      expect(newCounter.value).toBe(value);
      expect(newCounter.isLoading).toBeFalsy();
    });

    it("should handle a non-present counter", () => {
      state = [anotherCounter, yetAnotherCounter];

      const result = counterReducer(state, loadedAction);

      expect(result.length).toBe(state.length);
      const newCounter = getItemForIndex(result, index);
      expect(newCounter).toBeUndefined();
    });
  });

  describe("with the loaded all action", () => {
    it("should add all counters to the state", () => {
      expect(state.length).toBe(0);

      const result = counterReducer(state, loadedAllAction);

      expect(result).not.toBe(state);
      expect(state.length).toBe(0);
      expect(result.length).toBe(3);
      expect(getItemForIndex(result, anotherCounter.index)).toBe(anotherCounter);
      expect(getItemForIndex(result, counter.index)).toBe(counter);
      expect(getItemForIndex(result, yetAnotherCounter.index)).toBe(yetAnotherCounter);
    });

    it("should ignore doubles", () => {
      state = [anotherCounter, counter, yetAnotherCounter];

      const doubleCounter = new Counter(index, value);

      loadedAllAction.payload = {
        counters: [doubleCounter],
      };

      const result = counterReducer(state, loadedAllAction);

      expect(result.length).toBe(state.length);
      expect(getItemForIndex(result, counter.index)).toBe(counter);
      expect(getItemForIndex(result, doubleCounter.index)).toBe(counter);
    });

    it("should add counters to existing ones in the state", () => {
      state = [anotherCounter, yetAnotherCounter];

      loadedAllAction.payload = {
        counters: [anotherCounter, counter, yetAnotherCounter],
      };

      const result = counterReducer(state, loadedAllAction);

      expect(state.length).toBe(2);
      expect(result.length).toBe(3);
      expect(getItemForIndex(result, counter.index)).toBe(counter);
      expect(getItemForIndex(result, anotherCounter.index)).toBe(anotherCounter);
      expect(getItemForIndex(result, yetAnotherCounter.index)).toBe(yetAnotherCounter);
    });

    it("should sort the counters by index", () => {
      loadedAllAction.payload = {
        counters: [yetAnotherCounter, counter, anotherCounter],
      };

      const result = counterReducer(state, loadedAllAction);

      expect(result.length).toBe(3);
      expect(result[0].index).toBe(anotherCounter.index);
      expect(result[1].index).toBe(counter.index);
      expect(result[2].index).toBe(yetAnotherCounter.index);
    });
  });

  describe("with the load pending action", () => {
    it("should add a counter if the app state is empty", () => {
      const result = counterReducer(state, loadPendingAction);

      expect(state.length).toBe(0);
      expect(result.length).toBe(1);

      const newCounter = getItemForIndex(result, index);
      expect(newCounter.value).toBeUndefined();
      expect(newCounter.isLoading).toBeTruthy();
      expect(newCounter.isSaving).toBeFalsy();
    });

    it("should add a counter if the counter is not yet in the app state", () => {
      state = [anotherCounter, yetAnotherCounter];
      const result = counterReducer(state, loadPendingAction);

      expect(state.length).toBe(2);
      expect(result.length).toBe(3);

      const newCounter = getItemForIndex(result, index);
      expect(newCounter.value).toBeUndefined();
      expect(newCounter.isLoading).toBeTruthy();
      expect(newCounter.isSaving).toBeFalsy();
    });

    it("should not change the other counters if the counter is not yet in the app state", () => {
      state = [anotherCounter, yetAnotherCounter];
      const result = counterReducer(state, loadPendingAction);

      expect(state.length).toBe(2);
      expect(result.length).toBe(3);

      const newAnotherCounter = getItemForIndex(result, anotherCounter.index);
      expect(newAnotherCounter.value).toBe(anotherCounter.value);
      const newYetAnotherCounter = getItemForIndex(result, yetAnotherCounter.index);
      expect(newYetAnotherCounter.value).toBe(yetAnotherCounter.value);
    });

    it("should sort the counter list if the counter is not yet in the app state", () => {
      state = [anotherCounter, yetAnotherCounter];
      const result = counterReducer(state, loadPendingAction);

      expect(state.length).toBe(2);
      expect(result.length).toBe(3);
      expect(result[0].index).toBe(0);
      expect(result[1].index).toBe(1);
      expect(result[2].index).toBe(2);
    });

    it("should not add a counter if the counter already is in the app state", () => {
      counter = new Counter(index);
      counter.isLoading = true;
      state = [counter];

      const result = counterReducer(state, loadPendingAction);

      expect(state.length).toBe(1);
      expect(result).toBe(state);
    });
  });

  describe("with the load all pending action", () => {
    it("should not add to the app state", () => {
      const result = counterReducer(state, loadingAllAction);

      expect(state.length).toBe(0);
      expect(result.length).toBe(0);
    });

    it("should not change the app state", () => {
      state = [anotherCounter, counter, yetAnotherCounter];

      const result = counterReducer(state, loadingAllAction);

      expect(result).toBe(state);
    });
  });

  describe("with the save pending action", () => {
    it("should set the isSaving flag", () => {
      state = [anotherCounter, counter, yetAnotherCounter];

      const result = counterReducer(state, savePendingAction);

      expect(result).not.toBe(state);
      const newCounter = getItemForIndex(result, index);
      expect(newCounter).not.toBe(counter);
      expect(newCounter.isSaving).toBeTruthy();
      expect(getItemForIndex(result, anotherCounter.index)).toBe(anotherCounter);
      expect(getItemForIndex(result, yetAnotherCounter.index)).toBe(yetAnotherCounter);
    });
  });

  describe("with any other action", () => {
    it("should ignore unknown action types", () => {
      const anAction: IResetErrorsAction = {
        type: ErrorActionTypeKeys.RESET_ERRORS,
      };

      state = counterReducer(INITIAL_COUNTERS_STATE, anAction);

      expect(state).toBe(INITIAL_COUNTERS_STATE);
    });
  });
});
