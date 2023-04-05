#include <iostream>
#include <string>

using namespace std;

class Sample{
    int *p;
    int size;
public :
    Sample(int n);
    void read();
    void write();
    int big();
    ~Sample();
};
Sample::Sample(int n){
    size = n;
     p = new int[size];
}
void Sample::read(){
    for(int i = 0; i <size; i++){
        cin >> p[i];
    }
}
void Sample::write(){
    for(int i = 0 ; i < size; i++){
        cout << p[i] << " ";
    }
}
int Sample::big(){
    int max = 0;
    for(int i = 0; i < size; i++){
        if(max < p[i])
            max = p[i];
    }
    return max;
}
Sample::~Sample(){
    delete []p;
}

int main()
{
    Sample s(10);
    s.read();
    s.write();
    cout << s.big() <<endl;
}