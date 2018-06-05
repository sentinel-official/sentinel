package sentinelgroup.io.sentinel.ui.fragment;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.ReceiveViewModel;
import sentinelgroup.io.sentinel.viewmodel.ReceiveViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ReceiveFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ReceiveFragment extends Fragment implements View.OnClickListener {

    private ReceiveViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    ImageView mIvQrCode;
    TextView mTvAddress;
    ImageButton mIbCopyAddress;

    public ReceiveFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment ReceiveFragment.
     */
    public static ReceiveFragment newInstance() {
        return new ReceiveFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_receive, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.receive));
        initViewModel();
    }

    private void initView(View iView) {
        mIvQrCode = iView.findViewById(R.id.iv_qr_code);
        mTvAddress = iView.findViewById(R.id.tv_address);
        mIbCopyAddress = iView.findViewById(R.id.ib_copy_address);
        // set listeners
        mIbCopyAddress.setOnClickListener(this);
    }

    private void initViewModel() {
        ReceiveViewModelFactory aFactory = InjectorModule.provideReceiveViewModelFactory();
        mViewModel = ViewModelProviders.of(this, aFactory).get(ReceiveViewModel.class);
        mViewModel.getQrCodeLiveEvent().observe(this, bitmapResource -> {
            if (bitmapResource != null) {
                if (bitmapResource.data != null && bitmapResource.status.equals(Status.SUCCESS)) {
                    mIvQrCode.setImageBitmap(bitmapResource.data);
                } else if (bitmapResource.message != null && bitmapResource.status.equals(Status.ERROR)) {
                    showErrorDialog(bitmapResource.message);
                }
            }
        });
        //set value
        mTvAddress.setText(mViewModel.getAddress());
    }

    // Interface interaction methods
    public void fragmentLoaded(String iTitle) {
        if (mListener != null) {
            mListener.onFragmentLoaded(iTitle);
        }
    }

    public void showErrorDialog(String iError) {
        if (mListener != null) {
            mListener.onShowSingleActionDialog(iError);
        }
    }

    public void copyToClipboard(String iCopyString, int iToastTextId) {
        if (mListener != null) {
            mListener.onCopyToClipboardClicked(iCopyString, iToastTextId);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnGenericFragmentInteractionListener) {
            mListener = (OnGenericFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnGenericFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.ib_copy_address:
                if (!mTvAddress.getText().toString().isEmpty())
                    copyToClipboard(mTvAddress.getText().toString(), R.string.address_copied);
                break;
        }
    }
}
