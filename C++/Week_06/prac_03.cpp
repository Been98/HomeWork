#include <iostream>
#include <string>

using namespace std;

class Custom{
    string name;
    string tel;
public :
    Custom() = default;
    string getName() {return name;}
    string getTel() {return tel;}
    void set(string name, string tel){this->name = name, this-> tel = tel;}
};


class CustomManager{
    Custom *a;
    int size;
    string name;
    string tel;
public :
    CustomManager(int n);
    void show();
    void search();
    ~CustomManager();
};
CustomManager::CustomManager(int n){
    size = n;
    a = new Custom[size];
    for(int i = 0; i < size; i++){
        cin >> name >>tel;
        a[i].set(name,tel);
    }
}
void CustomManager::show(){
    for(int i = 0; i < size; i++){
        cout << i+1<<" "<<a[i].getName() <<" "<<a[i].getTel()<<endl;
    }
}
void CustomManager :: search(){
    cout << "전화번호 입력: ";
    cin >> tel;
    for(int i = 0; i < size; i++){
        if( a[i].getTel() == tel)
            cout << a[i].getName() << endl;
    }
}
CustomManager::~CustomManager(){
    delete [] a;
}

int main()
{
    CustomManager manager(3);
    manager.show();
    manager.search();
    return 0;
}