package sentinelgroup.io.sentinel.ui.adapter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

import sentinelgroup.io.sentinel.R;

public class MaterialSpinnerAdapter extends ArrayAdapter<String> {

    private Context mContext;
    private List<String> mItems;

    public MaterialSpinnerAdapter(@NonNull Context context, @NonNull List<String> items) {
        super(context, 0, items);
        mContext = context;
        mItems = items;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        View aView = convertView;
        if (aView == null)
            aView = LayoutInflater.from(mContext).inflate(R.layout.item_material_spinner, parent, false);

        String aItemValue = mItems.get(position);

        TextView aTvItemTitle = aView.findViewById(R.id.tv_item_title);
        aTvItemTitle.setText(aItemValue);

        return aView;
    }
}
