package sentinelgroup.io.sentinel.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;

import sentinelgroup.io.sentinel.R;

public class LauncherActivity extends AppCompatActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_launcher);
        initView();
    }

    private void initView() {
        findViewById(R.id.btn_create_auid).setOnClickListener(this);
        findViewById(R.id.btn_restore).setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_create_auid:
                startActivity(new Intent(this, CreateAccountActivity.class));
                break;

            case R.id.btn_restore:
                startActivity(new Intent(this, RestoreKeystoreActivity.class));
                break;
        }
    }
}