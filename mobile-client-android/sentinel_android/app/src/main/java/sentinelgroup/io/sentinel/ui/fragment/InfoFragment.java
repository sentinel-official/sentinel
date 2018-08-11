package sentinelgroup.io.sentinel.ui.fragment;


import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import sentinelgroup.io.sentinel.R;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link InfoFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class InfoFragment extends Fragment {
    private static final String ARG_IMAGE_1_ID = "image_1_id";
    private static final String ARG_IMAGE_2_ID = "image_2_id";
    private static final String ARG_INFO_TITLE_ID = "info_title";
    private static final String ARG_INFO_DESC_ID = "info_desc";

    private int mImage1Id, mImage2Id, mInfoTitleId, mInfoDescId;

    private ImageView mIvImage1, mIvImage2;
    private TextView mTvInfoTitle, mTvInfoDesc;


    public InfoFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param iImageId1  [int] Image 1 res id
     * @param iImageId2  [int] Image 2 - res id
     * @param iInfoTitle [int] Info title res id
     * @param iInfoDesc  [int] Info description res id
     * @return A new instance of fragment InfoFragment.
     */
    public static InfoFragment newInstance(int iImageId1, int iImageId2, int iInfoTitle, int iInfoDesc) {
        InfoFragment fragment = new InfoFragment();
        Bundle args = new Bundle();
        args.putInt(ARG_IMAGE_1_ID, iImageId1);
        args.putInt(ARG_IMAGE_2_ID, iImageId2);
        args.putInt(ARG_INFO_TITLE_ID, iInfoTitle);
        args.putInt(ARG_INFO_DESC_ID, iInfoDesc);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mImage1Id = getArguments().getInt(ARG_IMAGE_1_ID);
            mImage2Id = getArguments().getInt(ARG_IMAGE_2_ID);
            mInfoTitleId = getArguments().getInt(ARG_INFO_TITLE_ID);
            mInfoDescId = getArguments().getInt(ARG_INFO_DESC_ID);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_info, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        setValue();
    }

    private void initView(View iView) {
        mIvImage1 = iView.findViewById(R.id.iv_image_1);
        mIvImage2 = iView.findViewById(R.id.iv_image_2);
        mTvInfoTitle = iView.findViewById(R.id.tv_info_title);
        mTvInfoDesc = iView.findViewById(R.id.tv_info_desc);
    }

    private void setValue() {
        // set image 1 visibility and value
        mIvImage1.setVisibility(mImage1Id != -1 ? View.VISIBLE : View.GONE);
        if (mImage1Id != -1)
            mIvImage1.setImageResource(mImage1Id);
        // set image 2 visibility and value
        mIvImage2.setVisibility(mImage2Id != -1 ? View.VISIBLE : View.GONE);
        if (mImage2Id != -1)
            mIvImage2.setImageResource(mImage2Id);
        // set title text value
        if (mInfoTitleId != -1)
            mTvInfoTitle.setText(mInfoTitleId);
        // set title text value
        if (mInfoDescId != -1)
            mTvInfoDesc.setText(mInfoDescId);
    }
}
