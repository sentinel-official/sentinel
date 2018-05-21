package sentinelgroup.io.sentinel.ui.fragment;

import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import sentinelgroup.io.sentinel.R;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link CreateAuidFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link CreateAuidFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class CreateAuidFragment extends Fragment {

    private OnFragmentInteractionListener mListener;

    public CreateAuidFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment CreateAuidFragment.
     */
    public static CreateAuidFragment newInstance() {
        return new CreateAuidFragment();
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_create_auid, container, false);
    }

    public void onFragmentLoaded(String iTitle) {
        if (mListener != null) {
            mListener.onFragmentLoaded(iTitle);
        }
    }

    public void onLoadNextFragmentClicked(String iAccountAddress, String iPrivateKey, String iKeystoreFilePath) {
        if (mListener != null) {
            mListener.onLoadNextFragmentClicked(SecureKeysFragment.newInstance(iAccountAddress, iPrivateKey, iKeystoreFilePath));
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        void onFragmentLoaded(String iTitle);

        void onLoadNextFragmentClicked(Fragment iNextFragment);
    }
}
