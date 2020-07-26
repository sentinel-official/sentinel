package co.sentinel.lite.ui.custom;

import android.content.Context;
import android.support.annotation.Nullable;
import android.support.v7.widget.RecyclerView;
import android.util.AttributeSet;
import android.view.View;

public class EmptyRecyclerView extends RecyclerView {
    private View mEmptyView;
//    private RecyclerView.OnScrollListener onKeyboardDismissingScrollListener;
//    private InputMethodManager inputMethodManager;

    final private AdapterDataObserver mObserver = new AdapterDataObserver() {
        @Override
        public void onChanged() {
            checkIfEmpty();
        }

        @Override
        public void onItemRangeInserted(int positionStart, int itemCount) {
            checkIfEmpty();
        }

        @Override
        public void onItemRangeRemoved(int positionStart, int itemCount) {
            checkIfEmpty();
        }
    };

    public EmptyRecyclerView(Context context) {
        super(context);
    }

    public EmptyRecyclerView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public EmptyRecyclerView(Context context, @Nullable AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
//        setOnKeyboardDismissingListener();
    }

    void checkIfEmpty() {
        if (mEmptyView != null && getAdapter() != null) {
            final boolean emptyViewVisible =
                    getAdapter().getItemCount() == 0;
            mEmptyView.setVisibility(emptyViewVisible ? VISIBLE : GONE);
            setVisibility(emptyViewVisible ? GONE : VISIBLE);
        }
    }

//    /**
//     * Creates {@link OnScrollListener} that will dismiss keyboard when scrolling if the keyboard
//     * has not been dismissed internally before
//     */
//    private void setOnKeyboardDismissingListener() {
//        onKeyboardDismissingScrollListener = new RecyclerView.OnScrollListener() {
//            boolean isKeyboardDismissedByScroll;
//
//            @Override
//            public void onScrollStateChanged(RecyclerView recyclerView, int state) {
//                switch (state) {
//                    case RecyclerView.SCROLL_STATE_DRAGGING:
//                        if (!isKeyboardDismissedByScroll) {
//                            hideKeyboard();
//                            isKeyboardDismissedByScroll = !isKeyboardDismissedByScroll;
//                        }
//                        break;
//                    case RecyclerView.SCROLL_STATE_IDLE:
//                        isKeyboardDismissedByScroll = false;
//                        break;
//                }
//            }
//        };
//    }

    @Override
    public void setAdapter(Adapter adapter) {
        final Adapter oldAdapter = getAdapter();
        if (oldAdapter != null) {
            oldAdapter.unregisterAdapterDataObserver(mObserver);
        }
        super.setAdapter(adapter);
        if (adapter != null) {
            adapter.registerAdapterDataObserver(mObserver);
        }

        checkIfEmpty();
    }

//    @Override
//    protected void onAttachedToWindow() {
//        super.onAttachedToWindow();
//        addOnScrollListener(onKeyboardDismissingScrollListener);
//    }
//
//    @Override
//    protected void onDetachedFromWindow() {
//        super.onDetachedFromWindow();
//        removeOnScrollListener(onKeyboardDismissingScrollListener);
//    }

    public void setEmptyView(View emptyView) {
        this.mEmptyView = emptyView;
        checkIfEmpty();
    }

//    /**
//     * Hides the keyboard
//     */
//    public void hideKeyboard() {
//        getInputMethodManager().hideSoftInputFromWindow(getWindowToken(), 0);
//        clearFocus();
//    }
//
//    /**
//     * Returns an {@link InputMethodManager}
//     *
//     * @return input method manager
//     */
//    public InputMethodManager getInputMethodManager() {
//        if (null == inputMethodManager) {
//            inputMethodManager = (InputMethodManager) getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
//        }
//
//        return inputMethodManager;
//    }

}
