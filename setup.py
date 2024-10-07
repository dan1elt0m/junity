from setuptools import setup, find_packages

setup(
    name='jupyter_server_extension',
    version='0.1',
    packages=find_packages(),
    install_requires=[
        'notebook',
    ],
    include_package_data=True,
    data_files=[
        ('etc/jupyter/jupyter_notebook_config.d', [
            'jupyter_server_extension/etc/jupyter/jupyter_notebook_config.d/jupyter_server_extension.json'
        ])
    ],
    entry_points={
        'console_scripts': [
            'jupyter-serverextension = jupyter_server_extension:load_jupyter_server_extension'
        ]
    }
)