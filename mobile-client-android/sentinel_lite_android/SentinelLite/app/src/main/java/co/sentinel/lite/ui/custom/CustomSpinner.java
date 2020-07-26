//package co.sentinel.sentinellite.ui.custom;
//
//import android.content.Context;
//import android.os.Build;
//import android.support.annotation.Nullable;
//import android.util.AttributeSet;
//import android.view.MotionEvent;
//import android.widget.AdapterView;
//import android.widget.AutoCompleteTextView;
//import android.widget.ListAdapter;
//
//import com.weiwangcn.betterspinner.library.material.MaterialBetterSpinner;
//
//public class CustomSpinner extends MaterialBetterSpinner {
//    @Nullable
//    private AutoCompleteTextView.OnDismissListener onDismissListener;
//    @Nullable
//    private AdapterView.OnItemClickListener onItemClickListener;
//    private int selectedPosition = -1;
//
//    public CustomSpinner(Context context) {
//        super(context);
//        init();
//    }
//
//    public CustomSpinner(Context context, AttributeSet attributeSet) {
//        super(context, attributeSet);
//        init();
//    }
//
//    public CustomSpinner(Context context, AttributeSet attributeSet, int arg2) {
//        super(context, attributeSet, arg2);
//        init();
//    }
//
//    private void init() {
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
//            super.setOnDismissListener(() -> {
//                clearFocus();
//                if (onDismissListener != null) {
//                    onDismissListener.onDismiss();
//                }
//            });
//        }
//        super.setOnItemClickListener((parent, view, position, id) -> {
//            selectedPosition = position;
//            if (onItemClickListener != null) {
//                onItemClickListener.onItemClick(parent, view, position, id);
//            }
//        });
//    }
//
//    @Override
//    public void setOnDismissListener(AutoCompleteTextView.OnDismissListener dismissListener) {
//        this.onDismissListener = dismissListener;
//    }
//
//    @Override
//    public void setOnItemClickListener(AdapterView.OnItemClickListener onItemClickListener) {
//        this.onItemClickListener = onItemClickListener;
//    }
//
//    public int getSelectedPosition() {
//        return selectedPosition;
//    }
//
//    public void setSelectedPosition(int position) {
//        selectedPosition = position;
//        ListAdapter adapter = getAdapter();
//        if (adapter == null) {
//            setText("");
//            return;
//        }
//        Object object = getAdapter().getItem(position);
//        setText(object == null ? "" : object.toString());
//    }
//
//    @Override
//    protected void onTextChanged(CharSequence text, int start, int lengthBefore, int lengthAfter) {
//        //Fix for setText() and disappearing items
//    }
//
//    @Nullable
//    public Object getSelectedItem() {
//        if (selectedPosition < 0) {
//            return null;
//        }
//        ListAdapter adapter = getAdapter();
//        if (adapter == null) {
//            return null;
//        }
//        return adapter.getItem(selectedPosition);
//    }
//
//    @Override
//    public boolean onTouchEvent(MotionEvent event) { //Fix for empty data
//        ListAdapter adapter = getAdapter();
//        return !(adapter == null || adapter.isEmpty()) && super.onTouchEvent(event);
//    }
//}